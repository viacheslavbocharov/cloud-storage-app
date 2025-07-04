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
import { Button } from '@/components/ui/button';
import { BinToolbar } from '@/components/BinToolbar';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loadedFolders,
    viewingMode,
    foldersByParentId,
    filesByFolderId,
    currentPath,
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
              {viewingMode === 'trash' && (
                <span className="text-sm text-muted-foreground">Bin</span>
              )}
              {viewingMode === 'search' && (
                <span className="text-sm text-muted-foreground">
                  Search Results
                </span>
              )}
            </div>

            {viewingMode === 'trash' && (
              <BinToolbar />
            )}
          </header>

          {viewingMode === 'normal' && (
            <ItemList folders={folders} files={files} />
          )}
          {viewingMode === 'trash' && <BinView />}
          {viewingMode === 'search' && (
            <div className="p-4 text-sm text-muted-foreground">
              Search results will be shown here.
            </div>
          )}

          <CustomDragLayer />
        </SidebarInset>
      </SidebarProvider>
    </DndProvider>
  );
}
