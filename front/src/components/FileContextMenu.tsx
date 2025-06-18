// import type { ReactNode, MouseEvent } from 'react';
// import { useState } from 'react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Download, Edit2, Share2, Trash2, Link2, Lock } from 'lucide-react';

// type FileItem = {
//   sharedToken: string | null;
// };

// type FileContextMenuProps = {
//   children: ReactNode;
//   item: FileItem;
// };

// export function FileContextMenu({ children, item }: FileContextMenuProps) {
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
//       <DropdownMenu open={open} onOpenChange={setOpen}>
//         {/* 👇 Один валидный триггер-элемент */}
//         <DropdownMenuTrigger asChild>
//           <div onContextMenu={handleContextMenu}>{children}</div>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent
//           className="w-56"
//           sideOffset={0}
//           align="start"
//           style={{
//             position: 'absolute',
//             top: `${anchorPoint.y}px`,
//             left: `${anchorPoint.x}px`,
//             inset: 'unset',
//             zIndex: 1000,
//           }}
//           avoidCollisions={false}
//         >
//           <DropdownMenuItem>
//             <Download className="mr-2 h-4 w-4" /> Download
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Edit2 className="mr-2 h-4 w-4" /> Rename
//           </DropdownMenuItem>

//           <DropdownMenuSub>
//             <DropdownMenuSubTrigger>
//               <Share2 className="mr-2 h-4 w-4" /> Share
//             </DropdownMenuSubTrigger>
//             <DropdownMenuSubContent>
//               {item.sharedToken ? (
//                 <>
//                   <DropdownMenuItem>
//                     <Lock className="mr-2 h-4 w-4" /> Close Access
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link2 className="mr-2 h-4 w-4" /> Copy Link
//                   </DropdownMenuItem>
//                 </>
//               ) : (
//                 <DropdownMenuItem>
//                   <Share2 className="mr-2 h-4 w-4" /> Open Access
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuSubContent>
//           </DropdownMenuSub>

//           <DropdownMenuItem>
//             <Trash2 className="mr-2 h-4 w-4" /> Move to Bin
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }

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

// type FileItem = {
//   sharedToken: string | null;
// };

// type FileContextMenuProps = {
//   children: ReactNode;
//   item: FileItem;
// };

// export function FileContextMenu({ children, item }: FileContextMenuProps) {
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
//       {/* 🎯 Обёртка для ПКМ */}
//       <div onContextMenu={handleContextMenu}>{children}</div>

//       {/* 🎯 Меню без триггера */}
//       <DropdownMenu open={open} onOpenChange={setOpen}>
//         <DropdownMenuContent
//           className="w-56"
//           sideOffset={0}
//           align="start"
//           style={{
//             position: 'absolute',
//             top: `${anchorPoint.y}px`,
//             left: `${anchorPoint.x}px`,
//             inset: 'unset',
//             zIndex: 1000,
//           }}
//           avoidCollisions={false}
//         >
//           <DropdownMenuItem>
//             <Download className="mr-2 h-4 w-4" /> Download
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Edit2 className="mr-2 h-4 w-4" /> Rename
//           </DropdownMenuItem>

//           <DropdownMenuSub>
//             <DropdownMenuSubTrigger>
//               <Share2 className="mr-2 h-4 w-4" /> Share
//             </DropdownMenuSubTrigger>
//             <DropdownMenuSubContent>
//               {item.sharedToken ? (
//                 <>
//                   <DropdownMenuItem>
//                     <Lock className="mr-2 h-4 w-4" /> Close Access
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link2 className="mr-2 h-4 w-4" /> Copy Link
//                   </DropdownMenuItem>
//                 </>
//               ) : (
//                 <DropdownMenuItem>
//                   <Share2 className="mr-2 h-4 w-4" /> Open Access
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuSubContent>
//           </DropdownMenuSub>

//           <DropdownMenuItem>
//             <Trash2 className="mr-2 h-4 w-4" /> Move to Bin
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }

import type { ReactNode, MouseEvent } from 'react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Edit2, Share2, Trash2, Link2, Lock } from 'lucide-react';

// type FileItem = {
//   sharedToken: string | null;
// };

// type FileContextMenuProps = {
//   children: ReactNode;
//   item: FileItem;
// };

// export function FileContextMenu({ children, item }: FileContextMenuProps) {

export function FileContextMenu({ children, item }) {
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
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit2 className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {item.sharedToken ? (
                  <>
                    <DropdownMenuItem>
                      <Lock className="mr-2 h-4 w-4" /> Close Access
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link2 className="mr-2 h-4 w-4" /> Copy Link
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" /> Open Access
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" /> Move to Bin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
