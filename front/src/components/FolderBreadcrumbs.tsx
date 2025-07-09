// import React from 'react';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from '@/components/ui/sidebar-11-breadcrumb';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '@/store';
// import { setCurrentPath, setFolderContents } from '@/store/fileManagerSlice';
// import api from '@/utils/axios';
// import { MouseEvent, useMemo } from 'react';

// export function FolderBreadcrumbs() {
//   const dispatch = useDispatch<AppDispatch>();
//   const currentPath = useSelector(
//     (state: RootState) => state.fileManager.currentPath,
//   );
//   const foldersByParentId = useSelector(
//     (state: RootState) => state.fileManager.foldersByParentId,
//   );

//   const folderMap = useMemo(() => {
//     const map = new Map<string, { _id: string; name: string }>();
//     Object.values(foldersByParentId)
//       .flat()
//       .forEach((folder) => {
//         map.set(folder._id, folder);
//       });
//     return map;
//   }, [foldersByParentId]);

//   const handleClick = async (
//     folderId: string,
//     index: number,
//     e: MouseEvent,
//   ) => {
//     e.preventDefault();
//     const newPath = currentPath.slice(0, index + 1);
//     dispatch(setCurrentPath(newPath));

//     const res = await api.get('/folders/contents', {
//       params: { folderId },
//     });

//     dispatch(
//       setFolderContents({
//         parentFolderId: folderId,
//         folders: res.data.folders,
//         files: res.data.files,
//       }),
//     );
//   };

//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         {currentPath.map((id, index) => {
//           const folder = folderMap.get(id);
//           if (!folder) return null;

//           return (
//             <React.Fragment key={id}>
//               {index > 0 && <BreadcrumbSeparator />}
//               <BreadcrumbItem>
//                 <BreadcrumbLink
//                   href="#"
//                   onClick={(e) => handleClick(id, index, e)}
//                 >
//                   {folder.name}
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//             </React.Fragment>
//           );
//         })}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// }

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/sidebar-11-breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setCurrentPath, setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { MouseEvent, useMemo } from 'react';

export function FolderBreadcrumbs() {
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );
  const foldersByParentId = useSelector(
    (state: RootState) => state.fileManager.foldersByParentId,
  );

  const folderMap = useMemo(() => {
    const map = new Map<string, { _id: string; name: string }>();
    Object.values(foldersByParentId)
      .flat()
      .forEach((folder) => {
        map.set(folder._id, folder);
      });
    return map;
  }, [foldersByParentId]);

  const handleClick = async (
    folderId: string | null,
    path: string[],
    e: MouseEvent,
  ) => {
    e.preventDefault();
    dispatch(setCurrentPath(path));

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
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show My Drive */}
        <BreadcrumbItem>
          {currentPath.length > 0 ? (
            <BreadcrumbLink href="#" onClick={(e) => handleClick(null, [], e)}>
              My Drive
            </BreadcrumbLink>
          ) : (
            <span className="font-semibold">My Drive</span>
          )}
        </BreadcrumbItem>

        {currentPath.map((id, index) => {
          const folder = folderMap.get(id);
          if (!folder) return null;

          return (
            <React.Fragment key={id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) =>
                    handleClick(id, currentPath.slice(0, index + 1), e)
                  }
                >
                  {folder.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
