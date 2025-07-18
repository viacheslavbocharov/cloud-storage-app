import { File as FileIcon, Share2, MoreVertical } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { ContextMenu } from '@/components/ContextMenu';
import type { FileType } from '@/store/fileManagerSlice';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  setIsDragging,
  setDragItems,
  setSelectedIds,
  setLastSelectedId,
} from '@/store/fileManagerSlice';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { selectRange } from '@/store/fileManagerSlice';
import { store } from '@/store';

type Props = {
  item: FileType;
};

export function FileRow({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const rowRef = useRef<HTMLDivElement>(null);
  const { selectedIds, lastSelectedId, searchQuery } = useSelector(
    (state: RootState) => state.fileManager,
  );

  const shared = item.sharedToken !== null;
  const isSelected = selectedIds.includes(item._id);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      const newSelected = isSelected
        ? selectedIds.filter((id) => id !== item._id)
        : [...selectedIds, item._id];
      dispatch(setSelectedIds(newSelected));
      dispatch(setLastSelectedId(item._id));
    } else if (e.shiftKey && lastSelectedId) {
      dispatch(selectRange(item._id));
    } else {
      dispatch(setSelectedIds([item._id]));
      dispatch(setLastSelectedId(item._id));
    }
  };

  const handleDotsClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(setSelectedIds([item._id]));
    dispatch(setLastSelectedId(item._id));

    const syntheticEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    rowRef.current?.dispatchEvent(syntheticEvent);
  };

  const [, drag] = useDrag({
    type: 'ITEM',
    item: () => {
      dispatch(setIsDragging(true));

      const state = store.getState().fileManager;

      const allFolders = Object.values(state.foldersByParentId).flat();
      const allFiles = Object.values(state.filesByFolderId).flat();

      const payload = isSelected
        ? state.selectedIds.map((id) => {
            if (allFiles.some((f) => f._id === id)) {
              return { id, type: 'file' as const };
            }
            if (allFolders.some((f) => f._id === id)) {
              return { id, type: 'folder' as const };
            }
            throw new Error(`Unknown id ${id}`);
          })
        : [{ id: item._id, type: 'file' as const }];

      dispatch(setDragItems(payload));
      return { id: item._id };
    },
    end: () => {
      dispatch(setIsDragging(false));
      dispatch(setDragItems([]));
    },
  });

  const formattedPath = (() => {
    if (!item.key) return '/';
    const parts = item.key.split('/');
    if (parts.length <= 2) return '/';
    const sliced = parts.slice(1, -1);
    return '/' + sliced.join('/');
  })();

  return (
    <ContextMenu item={item} type="file">
      <div
        ref={(node) => {
          rowRef.current = node;
          drag(node);
        }}
        onClick={handleClick}
        className={cn(
          'group flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors',
          isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-muted',
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileIcon className="w-4 h-4 shrink-0 text-muted-foreground" />

          <OverflowTooltip className="w-[200px]">
            {item.originalName}
          </OverflowTooltip>
          {formattedPath && searchQuery && (
            <span className="text-xs text-muted-foreground ml-2">
              {formattedPath}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {shared && <Share2 className="w-4 h-4 text-primary" />}
          <MoreVertical
            className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100"
            onClick={handleDotsClick}
          />
        </div>
      </div>
    </ContextMenu>
  );
}
