import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setFolderContents } from '@/store/fileManagerSlice';
import api from '@/utils/axios';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type FolderUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FolderUploadDialog({ open, onOpenChange }: FolderUploadDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = useSelector((state: RootState) => state.fileManager.currentPath);
  const parentFolderId = currentPath[currentPath.length - 1] ?? null;

  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();

    Array.from(files).forEach((file, index) => {
      formData.append('files', file);
      // @ts-ignore: webkitRelativePath is non-standard
      formData.append(`paths[${index}]`, file.webkitRelativePath);
    });

    if (parentFolderId) {
      formData.append('folderId', parentFolderId);
    }

    try {
      await api.post('/folders/upload-folder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const res = await api.get('/folders/contents', {
        params: { folderId: parentFolderId },
      });

      dispatch(
        setFolderContents({
          parentFolderId,
          folders: res.data.folders,
          files: res.data.files,
        })
      );

      setFiles(null);
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Folder upload failed:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Folder</DialogTitle>
        </DialogHeader>

        <Input
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory=""
          onChange={(e) => setFiles(e.target.files)}
        />

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
