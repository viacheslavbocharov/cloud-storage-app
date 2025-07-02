// import { Folder } from 'lucide-react';
// import { OverflowTooltip } from '@/components/OverflowTooltip';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '@/store';
// import {
//   restoreItem,
//   setSelectedIds,
//   setLastSelectedId,
//   setCurrentPath,
//   selectRangeInBin,
// } from '@/store/fileManagerSlice';
// import { cn } from '@/lib/utils';
// import { MouseEvent } from 'react';

// import api from '@/utils/axios';

// import type { FolderType } from '@/store/fileManagerSlice';

// type Props = {
//   item: FolderType;
// };

// export function FolderRowBin({ item }: Props) {
//   const dispatch = useDispatch<AppDispatch>();
//   const selectedIds = useSelector(
//     (state: RootState) => state.fileManager.selectedIds,
//   );
//   const lastSelectedId = useSelector(
//     (state: RootState) => state.fileManager.lastSelectedId,
//   );
//   const isSelected = selectedIds.includes(item._id);

//   const handleClick = (e: MouseEvent) => {
//     e.stopPropagation();

//     if (e.ctrlKey || e.metaKey) {
//       const newSelected = isSelected
//         ? selectedIds.filter((id) => id !== item._id)
//         : [...selectedIds, item._id];
//       dispatch(setSelectedIds(newSelected));
//       dispatch(setLastSelectedId(item._id));
//     } else if (e.shiftKey && lastSelectedId) {
//       dispatch(selectRangeInBin(item._id));
//     } else {
//       dispatch(setSelectedIds([item._id]));
//       dispatch(setLastSelectedId(item._id));
//     }
//   };

//   const handleDoubleClick = () => {
//     dispatch(setSelectedIds([]));
//     dispatch(setCurrentPath([...item.path, item._id]));
//   };

//   const handleRestore = async (e: MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await api.post(`/folders/${item._id}/restore`);
//       dispatch(restoreItem(item._id));
//     } catch (err) {
//       console.error('Restore error', err);
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       onDoubleClick={handleDoubleClick}
//       className={cn(
//         'group flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors',
//         isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-muted',
//       )}
//     >
//       <div className="flex items-center gap-2 overflow-hidden">
//         <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />
//         <OverflowTooltip className="w-[180px] sm:w-[220px] md:w-[300px] lg:w-[400px]">
//           {item.name}
//         </OverflowTooltip>
//         <span className="text-xs text-muted-foreground ml-2">
//           {item.path.join(' / ')}
//         </span>
//       </div>

//       <button
//         onClick={handleRestore}
//         className="text-xs text-primary hover:underline"
//       >
//         Restore
//       </button>
//     </div>
//   );
// }

import { Folder } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  restoreItem,
  setSelectedIds,
  setLastSelectedId,
  setCurrentPath,
  selectRangeInBin,
} from '@/store/fileManagerSlice';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button'; // ✅ shadcn button

import api from '@/utils/axios';

import type { FolderType } from '@/store/fileManagerSlice';

type Props = {
  item: FolderType;
};

export function FolderRowBin({ item }: Props) {
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

  const handleDoubleClick = () => {
    dispatch(setSelectedIds([]));
    dispatch(setCurrentPath([...item.path, item._id]));
  };

  const handleRestore = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post(`/folders/${item._id}/restore`);
      dispatch(restoreItem(item._id));
    } catch (err) {
      console.error('Restore error', err);
    }
  };

  const formattedPath = (() => {
    if (!item.key) return '/';
    const parts = item.key.split('/');
    if (parts.length <= 2) return '/'; // например, ["id", "FolderName"]
    const sliced = parts.slice(1, -1);
    return '/' + sliced.join('/');
  })();

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'group flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors',
        isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-muted',
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />
        <OverflowTooltip className="w-[200px]">{item.name}</OverflowTooltip>
        {formattedPath && (
          <span className="text-xs text-muted-foreground ml-2">
            {formattedPath}
          </span>
        )}
      </div>

      <Button
        onClick={handleRestore}
        variant="outline"
        size="sm"
        className="text-xs w-20 rounded-md border border-input bg-background px-3 py-2 shadow-sm hover:bg-gray-300 hover:text-black cursor-pointer transition-colors"
      >
        Restore
      </Button>
    </div>
  );
}
