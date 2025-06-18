import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { FolderPlus, Upload, FolderUp, Plus } from 'lucide-react';

import { FileUploadDialog } from '@/components/fileUploadDialog';
import { FolderUploadDialog } from '@/components/folderUploadDialog';

export function CreateDropdown() {
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );
  const parentFolderId = currentPath[currentPath.length - 1] ?? null;

  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFolderUploadDialog, setShowFolderUploadDialog] = useState(false);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      await api.post('/folders', {
        name: folderName,
        parentFolderId,
      });

      // Перезагрузка содержимого текущей папки
      const res = await api.get('/folders/contents', {
        params: { folderId: parentFolderId },
      });

      dispatch(
        setFolderContents({
          parentFolderId,
          folders: res.data.folders,
          files: res.data.files,
        }),
      );

      setFolderName('');
      setOpen(false);
    } catch (err) {
      console.error('❌ Error creating folder:', err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-1/2 rounded-lg mb-[10px] pl-[3px] py-6 text-base font-medium shadow-sm cursor-pointer"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Files upload</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowFolderUploadDialog(true)}>
            <FolderUp className="mr-2 h-4 w-4" />
            <span>Folder upload</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />

      <FolderUploadDialog
        open={showFolderUploadDialog}
        onOpenChange={setShowFolderUploadDialog}
      />

      {/* Dialog Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
            autoFocus
          />
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFolder}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
