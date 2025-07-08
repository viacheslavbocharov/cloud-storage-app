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
import { BinView } from '@/components/BinView';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CustomDragLayer } from '@/components/CustomDragLayer';
import { BinToolbar } from '@/components/BinToolbar';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loadedFolders,
    viewingMode,
    foldersByParentId,
    filesByFolderId,
    currentPath,
    searchQuery,
    searchFolders,
    searchFiles,
  } = useSelector((state: RootState) => state.fileManager);

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
        console.error('Error during loading root contents:', err);
      }
    };

    if (viewingMode === 'normal') {
      loadRootContents();
    }
  }, [dispatch, loadedFolders, viewingMode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {viewingMode === 'normal' && <FolderBreadcrumbs />}
              {viewingMode === 'bin' && (
                <span className="text-sm text-muted-foreground font-semibold">
                  Bin
                </span>
              )}
            </div>

            {viewingMode === 'bin' && <BinToolbar />}
          </header>
          {searchQuery && (
            <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
              Search Results
            </div>
          )}

          {viewingMode === 'normal' && !searchQuery && (
            <ItemList folders={folders} files={files} />
          )}
          {viewingMode === 'normal' && searchQuery && (
            <ItemList folders={searchFolders} files={searchFiles} />
          )}

          {viewingMode === 'bin' && <BinView />}

          <CustomDragLayer />
        </SidebarInset>
      </SidebarProvider>
    </DndProvider>
  );
}
