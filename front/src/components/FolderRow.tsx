import { Folder, Share2, MoreVertical, Files } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { ContextMenu } from '@/components/ContextMenu';
import type { FolderType } from '@/store/fileManagerSlice';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  setSelectedIds,
  setCurrentPath,
  setIsDragging,
  setDragItems,
  setLastSelectedId,
  setSearchQuery,
  setSearchContents,
} from '@/store/fileManagerSlice';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';
import { moveItems } from '@/store/thunks/moveItems';
import { selectRange } from '@/store/fileManagerSlice';

import { setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { store } from '@/store';

type Props = {
  item: FolderType;
};

export function FolderRow({ item }: Props) {
  const shared = item.sharedToken !== null;
  const rowRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedIds, lastSelectedId, searchQuery, viewingMode, currentPath } =
    useSelector((state: RootState) => state.fileManager);

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

  const handleDoubleClick = async () => {
    dispatch(setSearchQuery(''));
    dispatch(setSearchContents({ folders: [], files: [] }));
    dispatch(setSelectedIds([]));
    dispatch(setCurrentPath(Array.from(new Set([...item.path, item._id]))));

    const res = await api.get('/folders/contents', {
      params: { folderId: item._id },
    });

    dispatch(
      setFolderContents({
        parentFolderId: item._id,
        folders: res.data.folders,
        files: res.data.files,
      }),
    );
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

  const formattedPath = (() => {
    if (!item.key) return '/';
    const parts = item.key.split('/');
    if (parts.length <= 2) return '/'; // например, ["id", "FolderName"]
    const sliced = parts.slice(1, -1);
    return '/' + sliced.join('/');
  })();

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
        : [{ id: item._id, type: 'folder' as const }];

      dispatch(setDragItems(payload));
      return { id: item._id };
    },
    end: () => {
      dispatch(setIsDragging(false));
      dispatch(setDragItems([]));
    },
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop: async () => {
      await dispatch(moveItems(item._id));
      if (searchQuery) {
        const res = await api.get('/search', {
          params: {
            query: searchQuery,
            isDeleted: viewingMode === 'bin' ? 'true' : 'false',
          },
        });
        dispatch(
          setSearchContents({
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <ContextMenu item={item} type="folder">
      <div
        ref={(node) => {
          drag(node);
          drop(node);
          rowRef.current = node;
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={cn(
          'group flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors',
          isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-muted',
          isOver && canDrop && 'bg-primary/10', // вот тут подсветка при drop
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />

          <OverflowTooltip className="w-[200px]">{item.name}</OverflowTooltip>
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
