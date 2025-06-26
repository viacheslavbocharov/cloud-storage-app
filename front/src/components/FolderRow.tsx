import { Folder, Share2, MoreVertical } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { ContextMenu } from '@/components/ContextMenu';
import type { FolderType } from '@/store/fileManagerSlice';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setSelectedIds, setCurrentPath } from '@/store/fileManagerSlice';

type Props = {
  item: FolderType;
};

export function FolderRow({ item }: Props) {
  const shared = item.sharedToken !== null;
  const rowRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );

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

  const handleDoubleClick = () => {
    dispatch(setSelectedIds([]));
    dispatch(setCurrentPath([...currentPath, item._id]));
    // Можно дополнительно отправить запрос на загрузку содержимого, если требуется
  };

  return (
    <ContextMenu item={item} type="folder">
      <div
        ref={rowRef}
        onDoubleClick={handleDoubleClick}
        className="group flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
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
