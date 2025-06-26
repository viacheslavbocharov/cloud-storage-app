import { File as FileIcon, Share2, MoreVertical } from 'lucide-react';
import { OverflowTooltip } from '@/components/OverflowTooltip';
import { ContextMenu } from '@/components/ContextMenu';
import type { FileType } from '@/store/fileManagerSlice';
import { useRef } from 'react';
import type { MouseEvent } from 'react';

type Props = {
  item: FileType;
};

export function FileRow({ item }: Props) {
  const shared = item.sharedToken !== null;
  const rowRef = useRef<HTMLDivElement>(null);

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

  return (
    <ContextMenu item={item} type="file">
      <div
        ref={rowRef}
        className="group flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileIcon className="w-4 h-4 shrink-0 text-muted-foreground" />

          <OverflowTooltip className="w-[180px] sm:w-[220px] md:w-[300px] lg:w-[400px]">
            {item.originalName}
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
