import * as React from 'react';
import { useState } from 'react';
import { ChevronRight, File, Folder } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/sidebar-11-collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar-11-sidebar';
import { CreateDropdown } from './CreateDropdown.tsx';
import { SearchInput } from './SearchInput.tsx';
import { BinButton } from './Bin.tsx';
import { AccountToolbar } from './AccountToolbar.tsx';
import { OverflowTooltip } from './OverflowTooltip.tsx';
import { ContextMenu } from './ContextMenu.tsx';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  FolderType,
  FileType,
  setCurrentPath,
  setFolderContents,
  setSelectedIds,
  setLastSelectedId,
} from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { RenameModal } from './RenameModal.tsx';

import { useDrop } from 'react-dnd';
import { moveItems } from '@/store/thunks/moveItems';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );
  const foldersByParentId = useSelector(
    (state: RootState) => state.fileManager.foldersByParentId,
  );
  const filesByFolderId = useSelector(
    (state: RootState) => state.fileManager.filesByFolderId,
  );
  const selectedIds = useSelector(
    (state: RootState) => state.fileManager.selectedIds,
  );

  const rootFolders = foldersByParentId['root'] || [];
  const rootFiles = filesByFolderId['root'] || []; 

  const [rootOpen, setRootOpen] = useState(true);

  const rootButtonRef = useRef<HTMLButtonElement | null>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop: () => {
      dispatch(moveItems(null)); // move to the root
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (rootButtonRef.current) {
      drop(rootButtonRef.current);
    }
  }, [drop]);

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <AccountToolbar />
          <SidebarGroup>
            <CreateDropdown />
            <SearchInput />
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* ✅ My Drive как collapsible */}
                <SidebarMenuItem>
                  <Collapsible
                    open={rootOpen}
                    onOpenChange={(open) => setRootOpen(open)}
                    className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        ref={rootButtonRef}
                        isActive={currentPath.length === 0}
                        onClick={() => dispatch(setCurrentPath([]))}
                        className={cn(
                          'font-semibold',
                          isOver && canDrop && 'bg-primary/10', // 👈 визуальная подсветка при drop
                        )}
                      >
                        <ChevronRight className="w-4 h-4 mr-1 transition-transform" />
                        <Folder className="w-4 h-4 mr-1" />
                        My Drive
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {rootFolders.map((folder) => (
                          <FolderTree key={folder._id} folder={folder} />
                        ))}
                        {rootFiles.map((file) => (
                          <ContextMenu
                            item={file as FileType}
                            type="file"
                            key={file._id}
                          >
                            <SidebarMenuButton
                              isActive={selectedIds.includes(file._id)} // ✅ добавлено
                              className="pl-6 text-sm text-muted-foreground hover:text-primary"
                            >
                              <File className="w-4 h-4 mr-1 shrink-0" />
                              <OverflowTooltip className="w-[180px]">
                                {file.originalName}
                              </OverflowTooltip>
                            </SidebarMenuButton>
                          </ContextMenu>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <BinButton />
          </SidebarGroup>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* file rename modal */}
      <RenameModal />
    </>
  );
}

type FolderTreeProps = {
  folder: {
    _id: string;
    name: string;
    path: string[];
  };
};

function FolderTree({ folder }: FolderTreeProps) {
  const dispatch = useDispatch<AppDispatch>();
  const foldersByParentId = useSelector(
    (state: RootState) => state.fileManager.foldersByParentId,
  );
  const filesByFolderId = useSelector(
    (state: RootState) => state.fileManager.filesByFolderId,
  );
  const loaded = useSelector((state: RootState) =>
    state.fileManager.loadedFolders.includes(folder._id),
  );

  const childrenFolder = foldersByParentId[folder._id] || [];
  const childrenFiles = filesByFolderId[folder._id] || [];

  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );
  const selectedIds = useSelector(
    (state: RootState) => state.fileManager.selectedIds,
  );
  const lastSelectedId = useSelector(
    (state: RootState) => state.fileManager.lastSelectedId,
  );
  const isActive = currentPath[currentPath.length - 1] === folder._id;
  const isSelected = selectedIds.includes(folder._id);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop: () => {
      dispatch(moveItems(folder._id));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleLoad = async () => {
    if (!loaded) {
      const res = await api.get('/folders/contents', {
        params: { folderId: folder._id },
      });
      dispatch(
        setFolderContents({
          parentFolderId: folder._id,
          folders: res.data.folders,
          files: res.data.files,
        }),
      );
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      const newSelected = isSelected
        ? selectedIds.filter((id) => id !== folder._id)
        : [...selectedIds, folder._id];
      dispatch(setSelectedIds(newSelected));
      dispatch(setLastSelectedId(folder._id));
    } else if (e.shiftKey && lastSelectedId) {
      dispatch(setSelectedIds([folder._id])); // Можно сделать selectRange позже
    } else {
      // Обычный клик: и путь, и выделение
      dispatch(setCurrentPath([...folder.path, folder._id]));
      dispatch(setSelectedIds([folder._id]));
      dispatch(setLastSelectedId(folder._id));
    }
  };

  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (btnRef.current) {
      drop(btnRef.current);
    }
  }, [drop]);

  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={false}
        onOpenChange={(open) => open && handleLoad()}
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      >
        <ContextMenu item={folder as FolderType} type="folder" key={folder._id}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              ref={btnRef}
              isActive={isSelected} // выделение
              onClick={handleClick}
              className={cn(
                'group data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
                isOver && canDrop && 'bg-primary/10',
              )}
            >
              <ChevronRight className="w-4 h-4 mr-1 transition-transform group-data-[state=open]:rotate-90" />
              <Folder className="w-4 h-4 mr-1 shrink-0" />
              <OverflowTooltip className="w-[180px]">
                {folder.name}
              </OverflowTooltip>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </ContextMenu>

        <CollapsibleContent>
          <SidebarMenuSub>
            {childrenFolder.map((childFolder) => (
              <FolderTree key={childFolder._id} folder={childFolder} />
            ))}
            {childrenFiles.map((childFile) => (
              <ContextMenu
                item={childFile as FileType}
                type="file"
                key={childFile._id}
              >
                <SidebarMenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                    const isFileSelected = selectedIds.includes(childFile._id);

                    if (e.ctrlKey || e.metaKey) {
                      const newSelected = isFileSelected
                        ? selectedIds.filter((id) => id !== childFile._id)
                        : [...selectedIds, childFile._id];
                      dispatch(setSelectedIds(newSelected));
                      dispatch(setLastSelectedId(childFile._id));
                    } else if (e.shiftKey && lastSelectedId) {
                      dispatch(setSelectedIds([childFile._id]));
                    } else {
                      dispatch(setSelectedIds([childFile._id]));
                      dispatch(setLastSelectedId(childFile._id));
                    }
                  }}
                  isActive={selectedIds.includes(childFile._id)}
                  className="pl-6 text-sm text-muted-foreground hover:text-primary"
                >
                  <File className="w-4 h-4 mr-1 shrink-0" />
                  <OverflowTooltip className="w-[180px]">
                    {childFile.originalName}
                  </OverflowTooltip>
                </SidebarMenuButton>
              </ContextMenu>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
