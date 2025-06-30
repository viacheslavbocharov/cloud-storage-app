// import { Folder, Share2, MoreVertical } from 'lucide-react';
// import { OverflowTooltip } from '@/components/OverflowTooltip';
// import { ContextMenu } from '@/components/ContextMenu';
// import type { FolderType } from '@/store/fileManagerSlice';
// import { useRef } from 'react';
// import type { MouseEvent } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@/store';
// import { setSelectedIds, setCurrentPath } from '@/store/fileManagerSlice';

// type Props = {
//   item: FolderType;
// };

// export function FolderRow({ item }: Props) {
//   const shared = item.sharedToken !== null;
//   const rowRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch<AppDispatch>();

//   const currentPath = useSelector(
//     (state: RootState) => state.fileManager.currentPath,
//   );

//   const handleDotsClick = (e: MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const syntheticEvent = new MouseEvent('contextmenu', {
//       bubbles: true,
//       cancelable: true,
//       clientX: e.clientX,
//       clientY: e.clientY,
//     });

//     rowRef.current?.dispatchEvent(syntheticEvent);
//   };

//   const handleDoubleClick = () => {
//     dispatch(setSelectedIds([]));
//     dispatch(setCurrentPath([...currentPath, item._id]));
//     // Можно дополнительно отправить запрос на загрузку содержимого, если требуется
//   };

//   return (
//     <ContextMenu item={item} type="folder">
//       <div
//         ref={rowRef}
//         onDoubleClick={handleDoubleClick}
//         className="group flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
//       >
//         <div className="flex items-center gap-2 overflow-hidden">
//           <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />

//           <OverflowTooltip className="w-[180px] sm:w-[220px] md:w-[300px] lg:w-[400px]">
//             {item.name}
//           </OverflowTooltip>
//         </div>

//         <div className="flex items-center gap-2 shrink-0">
//           {shared && <Share2 className="w-4 h-4 text-primary" />}
//           <MoreVertical
//             className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100"
//             onClick={handleDotsClick}
//           />
//         </div>
//       </div>
//     </ContextMenu>
//   );
// }

import { Folder, Share2, MoreVertical } from 'lucide-react';
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
} from '@/store/fileManagerSlice';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';
import { moveItems } from '@/store/thunks/moveItems';
import { selectRange } from '@/store/fileManagerSlice';

import { setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

type Props = {
  item: FolderType;
};

export function FolderRow({ item }: Props) {
  const shared = item.sharedToken !== null;
  const rowRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const selectedIds = useSelector(
    (state: RootState) => state.fileManager.selectedIds,
  );
  const lastSelectedId = useSelector(
    (state: RootState) => state.fileManager.lastSelectedId,
  );
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
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
      dispatch(selectRange(item._id));
    } else {
      dispatch(setSelectedIds([item._id]));
      dispatch(setLastSelectedId(item._id));
    }
  };

  const handleDoubleClick = async () => {
    dispatch(setSelectedIds([]));
    dispatch(setCurrentPath([...currentPath, item._id]));

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
      const payload = isSelected
        ? selectedIds.map((id) => ({ id, type: 'folder' as const })) // 👈 важно
        : [{ id: item._id, type: 'folder' as const }];
      dispatch(setDragItems(payload));
      return { id: item._id };
    },
    end: () => {
      dispatch(setIsDragging(false));
      dispatch(setDragItems([]));
    },
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: () => {
      dispatch(moveItems(item._id)); // 👈 сюда отправим dragItems в item._id
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
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
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Folder className="w-4 h-4 shrink-0 text-muted-foreground" />

          <OverflowTooltip className="w-[180px] sm:w-[220px] md:w-[300px] lg:w-[400px]">
            {item.name}
          </OverflowTooltip>
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
