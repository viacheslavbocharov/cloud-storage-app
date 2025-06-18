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
  SidebarGroupLabel,
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
import { FileContextMenu } from './FileContextMenu.tsx';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setCurrentPath, setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

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

  const rootFolders = foldersByParentId['root'] || []; //foldersByParentId — это объект, где ключ — parentFolderId, а значение — массив вложенных папок;
  const rootFiles = filesByFolderId['root'] || []; //filesByFolderId — это объект, где ключ — folderId, а значение — массив файлов в этой папке.

  const [rootOpen, setRootOpen] = useState(true);

  return (
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
                      isActive={currentPath.length === 0}
                      onClick={() => dispatch(setCurrentPath([]))}
                      className="font-semibold"
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
                        //ORIGIN
                        // <SidebarMenuButton
                        //   key={file._id}
                        //   className="pl-6 text-sm text-muted-foreground hover:text-primary"
                        // >
                        //   <File className="w-4 h-4 mr-1" />
                        //   {file.originalName}
                        // </SidebarMenuButton>

                        // <SidebarMenuButton
                        //   key={file._id}
                        //   className="pl-6 text-sm text-muted-foreground hover:text-primary relative group/file" // 🔄 уникальный group
                        //   style={{ overflow: 'visible' }}
                        // >
                        //   <File className="w-4 h-4 mr-1 shrink-0" />

                        //   <div className="truncate w-[180px]">
                        //     {file.originalName}
                        //   </div>

                        //   {/* Показывать только при наведении на этот file */}
                        //   <div className="absolute top-full left-0 mt-1 bg-white text-primary text-sm shadow-lg px-2 py-1 rounded z-50 max-w-xs hidden group-hover/file:block whitespace-normal">
                        //     {file.originalName}
                        //   </div>
                        // </SidebarMenuButton>

                        <FileContextMenu item={file}>
                          {/* worked part */}
                          <SidebarMenuButton className="pl-6 text-sm text-muted-foreground hover:text-primary">
                            <File className="w-4 h-4 mr-1 shrink-0" />
                            <OverflowTooltip className="w-[180px]">
                              {file.originalName}
                            </OverflowTooltip>
                          </SidebarMenuButton>
                        </FileContextMenu>
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
  );
}

type FolderTreeProps = {
  folder: {
    _id: string;
    name: string;
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
  const isActive = currentPath[currentPath.length - 1] === folder._id;

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

  const handleClick = () => {
    dispatch(setCurrentPath([folder._id]));
  };

  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={false}
        onOpenChange={(open) => open && handleLoad()}
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      >
        <CollapsibleTrigger asChild>
          {/* <SidebarMenuButton
            isActive={isActive}
            onClick={handleClick}
            className="group data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            <ChevronRight className="w-4 h-4 mr-1 transition-transform group-data-[state=open]:rotate-90" />
            <Folder className="w-4 h-4 mr-1" />
            {folder.name}
          </SidebarMenuButton> */}

          <SidebarMenuButton
            isActive={isActive}
            onClick={handleClick}
            className="group data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            <ChevronRight className="w-4 h-4 mr-1 transition-transform group-data-[state=open]:rotate-90" />
            <Folder className="w-4 h-4 mr-1 shrink-0" />
            <OverflowTooltip className="w-[180px]">
              {folder.name}
            </OverflowTooltip>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {childrenFolder.map((childFolder) => (
              <FolderTree key={childFolder._id} folder={childFolder} />
            ))}
            {childrenFiles.map((childFile) => (
              //ORIGIN
              // <SidebarMenuButton
              //   key={childFile._id}
              //   className="pl-6 text-sm text-muted-foreground hover:text-primary"
              // >
              //   <File className="w-4 h-4 mr-1" />
              //   {childFile.originalName}
              // </SidebarMenuButton>

              // <SidebarMenuButton
              //   key={childFile._id}
              //   className="pl-6 text-sm text-muted-foreground hover:text-primary relative group/file" // 🔄 уникальный group
              //   style={{ overflow: 'visible' }}
              // >
              //   <File className="w-4 h-4 mr-1 shrink-0" />

              //   <div className="truncate w-[180px]">
              //     {childFile.originalName}
              //   </div>

              //   {/* Показывать только при наведении на этот file */}
              //   <div className="absolute top-full left-0 mt-1 bg-white text-primary text-sm shadow-lg px-2 py-1 rounded z-50 max-w-xs hidden group-hover/file:block whitespace-normal">
              //     {childFile.originalName}
              //   </div>
              // </SidebarMenuButton>

              <FileContextMenu item={childFile}>
                {/* worked part */}
                <SidebarMenuButton className="pl-6 text-sm text-muted-foreground hover:text-primary">
                  <File className="w-4 h-4 mr-1 shrink-0" />
                  <OverflowTooltip className="w-[180px]">
                    {childFile.originalName}
                  </OverflowTooltip>
                </SidebarMenuButton>
              </FileContextMenu>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
