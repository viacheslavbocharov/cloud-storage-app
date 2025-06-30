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

type FileUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FileUploadDialog({
  open,
  onOpenChange,
}: FileUploadDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );
  const parentFolderId = currentPath[currentPath.length - 1] ?? null;

  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('files', file);
    }
    if (parentFolderId) {
      formData.append('folderId', parentFolderId);
    }

    try {
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Обновляем содержимое текущей папки
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

      setFiles(null);
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <Input
          type="file"
          multiple
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
