import { ReactNode, MouseEvent, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Edit2, Share2, Trash2, Link2, Lock } from 'lucide-react';

import type { FileType } from '@/store/fileManagerSlice';
import type { FolderType } from '@/store/fileManagerSlice';
import { callFileDownload } from '@/utils/callFileDownload';

import { useDispatch } from 'react-redux';
import { openRenameModal } from '@/store/fileManagerSlice';

import { CopyLinkModal } from './CopyLinkModal';
import {
  updateFileShareLink,
  deleteItem,
  setFolderContents,
} from '@/store/fileManagerSlice';
import api from '@/utils/axios';

type ContextMenuProps =
  | { item: FileType; type: 'file'; children: ReactNode }
  | { item: FolderType; type: 'folder'; children: ReactNode };

export function ContextMenu({ children, item, type }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    const menuWidth = 220;
    const menuHeight = 200;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > screenW) x = screenW - menuWidth - 10;
    if (y + menuHeight > screenH) y = screenH - menuHeight - 10;

    setAnchorPoint({ x, y });
    setOpen(true);
  };

  const handleDownload = async () => {
    if (type === 'file') {
      const url = `/api/files/${item._id}/download`;
      callFileDownload(url, item.originalName);
    } else {
      console.log(`[Folder] Downloading: ${item.name}`);
      // e.g. callFolderDownload(item.id)
    }
  };

  const dispatch = useDispatch();
  const handleRename = () => {
    if (type === 'file') {
      dispatch(
        openRenameModal({
          id: item._id,
          originalName: item.originalName,
          type,
        }),
      );
    } else {
      dispatch(
        openRenameModal({
          id: item._id,
          originalName: item.name,
          type,
        }),
      );
    }
  };

  const handleShare = async () => {
    if (type === 'file') {
      try {
        const res = await api.patch<{ sharedUrl: string }>(
          `files/${item._id}/share`,
        );

        const sharedUrl = `http://192.168.1.99:3000/api${res.data.sharedUrl}`;

        dispatch(
          updateFileShareLink({
            id: item._id,
            sharedToken: res.data.sharedUrl.split('/').pop()!,
          }),
        );
        setShareUrl(sharedUrl);
      } catch (e) {
        console.error('Failed to share file', e);
      }
    } else {
      console.log(`[Folder] Open access to: ${item.name}`);
      // shareFolder(item)
    }
  };

  const handleRevoke = async () => {
    if (type === 'file') {
      try {
        await api.patch(`files/${item._id}/unshare`);

        dispatch(updateFileShareLink({ id: item._id, sharedToken: null }));
      } catch (e) {
        console.error('Failed to revoke link access', e);
      }
    } else {
      console.log(`[Folder] Access revoked: ${item.name}`);
      // revokeFolderAccess(item.id)
    }
  };

  const handleCopyLink = () => {
    if (type === 'file') {
      if (type === 'file' && item.sharedToken) {
        const sharedUrl = `http://192.168.1.99:3000/api/files/shared/${item.sharedToken}`;
        setShareUrl(sharedUrl);
      }
    } else {
      console.log(`[Folder] Copying link: ${item.name}`);
      // navigator.clipboard.writeText(...)
    }
  };

  const handleMoveToBin = async () => {
    if (type === 'file') {
      try {
        await api.delete(`files/${item._id}`);
        dispatch(deleteItem(item._id));

        const folderId = item.folderId ?? null;

        const res = await api.get('/folders/contents', {
          params: folderId ? { folderId } : undefined,
        });

        dispatch(
          setFolderContents({
            parentFolderId: folderId,
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      } catch (e) {
        console.error('Failed to move file to bin', e);
      }
    } else {
      console.log(`[Folder] Moved to bin: ${item.name}`);
      // реализация аналогична, если будет soft delete для папок
    }
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>

      {open && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuContent
            className="w-56"
            sideOffset={0}
            align="start"
            style={{
              position: 'fixed',
              top: `${anchorPoint.y}px`,
              left: `${anchorPoint.x}px`,
              zIndex: 9999,
            }}
            avoidCollisions={false}
          >
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleRename}>
              <Edit2 className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {item.sharedToken ? (
                  <>
                    <DropdownMenuItem onClick={handleRevoke}>
                      <Lock className="mr-2 h-4 w-4" /> Close Access
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Link2 className="mr-2 h-4 w-4" /> Copy Link
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Open Access
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={handleMoveToBin}>
              <Trash2 className="mr-2 h-4 w-4" /> Move to Bin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {shareUrl && (
        <CopyLinkModal
          open={true}
          onClose={() => setShareUrl(null)}
          url={shareUrl}
        />
      )}
    </>
  );
}
