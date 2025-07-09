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

import { useDispatch, useSelector } from 'react-redux';
import {
  openRenameModal,
  setLastSelectedId,
  setSelectedIds,
} from '@/store/fileManagerSlice';

import { CopyLinkModal } from './CopyLinkModal';
import {
  updateItemShareLink,
  deleteItem,
  setFolderContents,
} from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { callFolderDownload } from '@/utils/callFolderDownload';
import { store, RootState } from '@/store';
import { refreshSearchResults } from '@/utils/reloadSearchResults';

// type ContextMenuProps =
//   | { item: FileType; type: 'file'; children: ReactNode }
//   | { item: FolderType; type: 'folder'; children: ReactNode };
export type ContextMenuProps =
  | {
      item: FileType;
      type: 'file';
      children: React.ReactNode;
    }
  | {
      item: FolderType;
      type: 'folder';
      children: React.ReactNode;
    };

export function ContextMenu({ children, item, type }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const { searchQuery, viewingMode, selectedIds } = useSelector(
    (state: RootState) => state.fileManager,
  );

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    const isAlreadySelected = selectedIds.includes(item._id);
    if (!(selectedIds.length > 0 && isAlreadySelected)) {
      dispatch(setSelectedIds([item._id]));
      dispatch(setLastSelectedId(item._id));
    }

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
      const url = `/files/${item._id}/download`;
      callFileDownload(url, item.originalName);
    } else {
      const url = `/folders/${item._id}/download`;
      callFolderDownload(url, item.name);
    }
  };

  const dispatch = useDispatch();

  const handleRename = async () => {
    if (type === 'file') {
      dispatch(
        openRenameModal({
          id: item._id,
          originalName: item.originalName,
          type,
        }),
      );
    } else if (type === 'folder') {
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
    try {
      const path = type === 'file' ? 'files' : 'folders';

      const res = await api.patch<{ sharedUrl: string }>(
        `${path}/${item._id}/share`,
      );

      const sharedUrl = `http://localhost:3000/api${res.data.sharedUrl}`;

      dispatch(
        updateItemShareLink({
          id: item._id,
          sharedToken: res.data.sharedUrl.split('/').pop()!,
        }),
      );
      setShareUrl(sharedUrl);

      if (searchQuery) {
        await refreshSearchResults(dispatch, searchQuery, viewingMode);
      }
    } catch (e) {
      console.error(`Failed to share ${type}`, e);
    }
  };

  const handleRevoke = async () => {
    try {
      const path = type === 'file' ? 'files' : 'folders';

      await api.patch(`${path}/${item._id}/unshare`);

      dispatch(updateItemShareLink({ id: item._id, sharedToken: null }));

      if (searchQuery) {
        await refreshSearchResults(dispatch, searchQuery, viewingMode);
      }
    } catch (e) {
      console.error(`Failed to revoke ${type} link access`, e);
    }
  };

  const handleCopyLink = () => {
    if (!item.sharedToken) return;

    const base = type === 'file' ? 'files' : 'folders';
    const sharedUrl = `http://localhost:3000/api/${base}/shared/${item.sharedToken}`;

    setShareUrl(sharedUrl);
  };

  // const handleMoveToBin = async () => {
  //   try {
  //     const state = store.getState().fileManager;
  //     const { selectedIds, foldersByParentId, filesByFolderId } = state;

  //     // Если есть выделенные элементы
  //     const idsToDelete = selectedIds.length > 0 ? selectedIds : [item._id];

  //     // Собираем все папки и файлы
  //     const allFolders = Object.values(foldersByParentId).flat();
  //     const allFiles = Object.values(filesByFolderId).flat();

  //     // Преобразуем в массив объектов {id, type}
  //     const itemsToDelete = idsToDelete.map((id) => {
  //       if (allFiles.some((f) => f._id === id)) {
  //         return { id, type: 'file' as const };
  //       }
  //       if (allFolders.some((f) => f._id === id)) {
  //         return { id, type: 'folder' as const };
  //       }
  //       // Если элемент не найден
  //       throw new Error(`Unknown item id: ${id}`);
  //     });

  //     // Запускаем удаление всех элементов параллельно
  //     await Promise.all(
  //       itemsToDelete.map(async ({ id, type }) => {
  //         if (type === 'file') {
  //           await api.delete(`files/${id}`);
  //         } else {
  //           await api.delete(`folders/${id}`);
  //         }
  //         dispatch(deleteItem(id));
  //       }),
  //     );

  //     // После удаления — обновляем список содержимого текущей папки
  //     const folderId =
  //       type === 'file'
  //         ? (item as any).folderId ?? null
  //         : (item as any).parentFolderId ?? null;

  //     const res = await api.get('/folders/contents', {
  //       params: folderId ? { folderId } : undefined,
  //     });

  //     dispatch(
  //       setFolderContents({
  //         parentFolderId: folderId,
  //         folders: res.data.folders,
  //         files: res.data.files,
  //       }),
  //     );
  //   } catch (e) {
  //     console.error(`Failed to move to bin`, e);
  //   }
  // };

  const handleMoveToBin = async () => {
    try {
      const state = store.getState().fileManager;
      const {
        selectedIds,
        foldersByParentId,
        filesByFolderId,
        searchFolders,
        searchFiles,
        viewingMode,
        searchQuery,
        currentPath,
      } = state;

      // Если есть выделенные элементы
      const idsToDelete = selectedIds.length > 0 ? selectedIds : [item._id];

      const allFolders =
        searchQuery && viewingMode === 'normal'
          ? searchFolders
          : Object.values(foldersByParentId).flat();

      const allFiles =
        searchQuery && viewingMode === 'normal'
          ? searchFiles
          : Object.values(filesByFolderId).flat();

      // Преобразуем в массив объектов {id, type}
      const itemsToDelete = idsToDelete.map((id) => {
        if (allFiles.some((f) => f._id === id)) {
          return { id, type: 'file' as const };
        }
        if (allFolders.some((f) => f._id === id)) {
          return { id, type: 'folder' as const };
        }
        // Если элемент не найден
        throw new Error(`Unknown item id: ${id}`);
      });

      // Запускаем удаление всех элементов параллельно
      await Promise.all(
        itemsToDelete.map(async ({ id, type }) => {
          if (type === 'file') {
            await api.delete(`files/${id}`);
          } else {
            await api.delete(`folders/${id}`);
          }
          dispatch(deleteItem(id));
        }),
      );

      if (searchQuery) {
        await refreshSearchResults(dispatch, searchQuery, viewingMode);
      }

      // После удаления — обновляем список содержимого текущей папки
      const parentFolderId =
        currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

      const res = await api.get('/folders/contents', {
        params: parentFolderId ? { folderId: parentFolderId } : undefined,
      });

      dispatch(
        setFolderContents({
          parentFolderId,
          folders: res.data.folders,
          files: res.data.files,
        }),
      );

      // Обновляем корень для Sidebar
      const resRoot = await api.get('/folders/contents');
      dispatch(
        setFolderContents({
          parentFolderId: null,
          folders: resRoot.data.folders,
          files: resRoot.data.files,
        }),
      );
    } catch (e) {
      console.error(`Failed to move to bin`, e);
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
