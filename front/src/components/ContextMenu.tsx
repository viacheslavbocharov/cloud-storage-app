// import type { ReactNode, MouseEvent } from 'react';
// import { useState } from 'react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Download, Edit2, Share2, Trash2, Link2, Lock } from 'lucide-react';

// // type FileItem = {
// //   sharedToken: string | null;
// // };

// // type FileContextMenuProps = {
// //   children: ReactNode;
// //   item: FileItem;
// // };

// // export function FileContextMenu({ children, item }: FileContextMenuProps) {

// export function ContextMenu({ children, item }) {
//   const [open, setOpen] = useState(false);
//   const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

//   const handleContextMenu = (e: MouseEvent) => {
//     e.preventDefault();

//     const menuWidth = 220;
//     const menuHeight = 200;
//     const screenW = window.innerWidth;
//     const screenH = window.innerHeight;

//     let x = e.clientX;
//     let y = e.clientY;

//     if (x + menuWidth > screenW) x = screenW - menuWidth - 10;
//     if (y + menuHeight > screenH) y = screenH - menuHeight - 10;

//     setAnchorPoint({ x, y });
//     setOpen(true);
//   };

//   return (
//     <>
//       <div onContextMenu={handleContextMenu}>{children}</div>

//       {open && (
//         <DropdownMenu open={open} onOpenChange={setOpen}>
//           <DropdownMenuContent
//             className="w-56"
//             sideOffset={0}
//             align="start"
//             style={{
//               position: 'fixed',
//               top: `${anchorPoint.y}px`,
//               left: `${anchorPoint.x}px`,
//               zIndex: 9999,
//             }}
//             avoidCollisions={false}
//           >
//             <DropdownMenuItem>
//               <Download className="mr-2 h-4 w-4" /> Download
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Edit2 className="mr-2 h-4 w-4" /> Rename
//             </DropdownMenuItem>

//             <DropdownMenuSub>
//               <DropdownMenuSubTrigger>
//                 <Share2 className="mr-2 h-4 w-4" /> Share
//               </DropdownMenuSubTrigger>
//               <DropdownMenuSubContent>
//                 {item.sharedToken ? (
//                   <>
//                     <DropdownMenuItem>
//                       <Lock className="mr-2 h-4 w-4" /> Close Access
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Link2 className="mr-2 h-4 w-4" /> Copy Link
//                     </DropdownMenuItem>
//                   </>
//                 ) : (
//                   <DropdownMenuItem>
//                     <Share2 className="mr-2 h-4 w-4" /> Open Access
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuSubContent>
//             </DropdownMenuSub>

//             <DropdownMenuItem>
//               <Trash2 className="mr-2 h-4 w-4" /> Move to Bin
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )}
//     </>
//   );
// }

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

type ContextMenuProps =
  | { item: FileType; type: 'file'; children: ReactNode }
  | { item: FolderType; type: 'folder'; children: ReactNode };

export function ContextMenu({ children, item, type }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

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
      // console.log(`[File] Rename requested: ${item.originalName}`);
      // shareFile(item)
      dispatch(
        openRenameModal({
          id: item._id,
          originalName: item.originalName,
          type,
        }),
      );
    } else {
      // console.log(`[Folder] Rename requested: ${item.name}`);
      // openRenameFolderModal(item)
      dispatch(
        openRenameModal({
          id: item._id,
          originalName: item.name,
          type,
        }),
      );
    }
  };

  const handleShare = () => {
    if (type === 'file') {
      console.log(`[File] Open access to: ${item.originalName}`);
      // shareFile(item)
    } else {
      console.log(`[Folder] Open access to: ${item.name}`);
      // shareFolder(item)
    }
  };

  const handleRevoke = () => {
    if (type === 'file') {
      console.log(`[File] Access revoked: ${item.originalName}`);
      // revokeFileAccess(item.id)
    } else {
      console.log(`[Folder] Access revoked: ${item.name}`);
      // revokeFolderAccess(item.id)
    }
  };

  const handleCopyLink = () => {
    if (type === 'file') {
      console.log(`[File] Copying link: ${item.originalName}`);
      // navigator.clipboard.writeText(...)
    } else {
      console.log(`[Folder] Copying link: ${item.name}`);
      // navigator.clipboard.writeText(...)
    }
  };

  const handleMoveToBin = () => {
    if (type === 'file') {
      console.log(`[File] Moved to bin: ${item.originalName}`);
      // deleteFile(item.id)
    } else {
      console.log(`[Folder] Moved to bin: ${item.name}`);
      // deleteFolder(item.id)
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
    </>
  );
}
