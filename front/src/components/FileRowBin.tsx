import { File as FileIcon } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  setSelectedIds,
  setLastSelectedId,
  selectRangeInBin,
} from '@/store/fileManagerSlice';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

import type { FileType } from '@/store/fileManagerSlice';

type Props = {
  item: FileType;
};

export function FileRowBin({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedIds = useSelector(
    (state: RootState) => state.fileManager.selectedIds,
  );
  const lastSelectedId = useSelector(
    (state: RootState) => state.fileManager.lastSelectedId,
  );
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
      dispatch(selectRangeInBin(item._id));
    } else {
      dispatch(setSelectedIds([item._id]));
      dispatch(setLastSelectedId(item._id));
    }
  };

  const formattedPath = (() => {
    if (!item.key) return '/';
    const parts = item.key.split('/');
    if (parts.length <= 2) return '/';
    const sliced = parts.slice(1, -1);
    return '/' + sliced.join('/');
  })();

  return (
    <div
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
        {formattedPath && (
          <span className="text-xs text-muted-foreground ml-2">
            {formattedPath}
          </span>
        )}
      </div>
    </div>
  );
}
