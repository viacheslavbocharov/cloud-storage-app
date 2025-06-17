import * as React from 'react';
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
import { CreateDropdown } from '../components/create-dropdown';
import { SearchInput } from '../components/search-input';
import { BinButton } from '../components/bin';
import { AccountToolbar } from '../components/account-toolbar';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setCurrentPath, setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const dispatch = useDispatch<AppDispatch>();
  // const currentPath = useSelector((state: RootState) => state.fileManager.currentPath);
  const foldersByParentId = useSelector((state: RootState) => state.fileManager.foldersByParentId);
  const filesByFolderId = useSelector((state: RootState) => state.fileManager.filesByFolderId);

  const rootFolders = foldersByParentId['root'] || []; //foldersByParentId — это объект, где ключ — parentFolderId, а значение — массив вложенных папок;
  const rootFiles = filesByFolderId['root'] || []; //filesByFolderId — это объект, где ключ — folderId, а значение — массив файлов в этой папке.

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
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {rootFolders.map((folder) => (
                <FolderTree key={folder._id} folder={folder} />
              ))}
              {rootFiles.map((file) => (
                <SidebarMenuButton
                  key={file._id}
                  className="pl-6 text-sm text-muted-foreground hover:text-primary"
                >
                  <File className="w-4 h-4 mr-1" />
                  {file.originalName}
                </SidebarMenuButton>
              ))}
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
  const foldersByParentId = useSelector((state: RootState) => state.fileManager.foldersByParentId);
  const filesByFolderId = useSelector((state: RootState) => state.fileManager.filesByFolderId);
  const loaded = useSelector((state: RootState) => state.fileManager.loadedFolders.includes(folder._id));

  const childrenFolder = foldersByParentId[folder._id] || [];
  const childrenFiles = filesByFolderId[folder._id] || [];

  const handleLoad = async () => {
    if (!loaded) {
      const res = await api.get('/folders/contents', { params: { folderId: folder._id } });
      dispatch(
        setFolderContents({
          parentFolderId: folder._id,
          folders: res.data.folders,
          files: res.data.files,
        })
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
          <SidebarMenuButton onClick={handleClick} className="group">
            <ChevronRight className="w-4 h-4 mr-1 transition-transform group-data-[state=open]:rotate-90" />
            <Folder className="w-4 h-4 mr-1" />
            {folder.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {childrenFolder.map((childFolder) => (
              <FolderTree key={childFolder._id} folder={childFolder} />
            ))}
            {childrenFiles.map((childFile) => (
              <SidebarMenuButton
                key={childFile._id}
                className="pl-6 text-sm text-muted-foreground hover:text-primary"
              >
                <File className="w-4 h-4 mr-1" />
                {childFile.originalName}
              </SidebarMenuButton>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
