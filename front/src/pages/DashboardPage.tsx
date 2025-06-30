import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

import { AppSidebar } from '@/components/Sidebar-11';
import { Separator } from '@/components/ui/sidebar-11-separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar-11-sidebar';

import { ItemList } from '@/components/ItemList';
import { FolderBreadcrumbs } from '@/components/FolderBreadcrumbs';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CustomDragLayer } from '@/components/CustomDragLayer';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loadedFolders } = useSelector(
    (state: RootState) => state.fileManager,
  );

  const { foldersByParentId, filesByFolderId, currentPath } = useSelector(
    (state: RootState) => state.fileManager,
  );

  const currentFolderId =
    currentPath.length > 0 ? currentPath[currentPath.length - 1] : 'root';

  const folders = foldersByParentId[currentFolderId] ?? [];
  const files = filesByFolderId[currentFolderId] ?? [];

  useEffect(() => {
    const loadRootContents = async () => {
      try {
        if (loadedFolders.includes('root')) return;

        const res = await api.get('/folders/contents');
        dispatch(
          setFolderContents({
            parentFolderId: null,
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      } catch (err) {
        console.error('Ошибка при загрузке корневого contents:', err);
      }
    };

    loadRootContents();
  }, [dispatch, loadedFolders]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <FolderBreadcrumbs />
          </header>

          <ItemList folders={folders} files={files} />
          <CustomDragLayer />
        </SidebarInset>
      </SidebarProvider>
    </DndProvider>
  );
}
