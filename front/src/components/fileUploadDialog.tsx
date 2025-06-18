// import { useRef, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import api from "@/utils/axios";

// type Props = {
//   open: boolean;
//   onClose: () => void;
// };

// export function FileUploadDialog({ open, onClose }: Props) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

//   const currentPath = useSelector((state: RootState) => state.fileManager.currentPath);
//   const folderId = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFiles(e.target.files);
//   };

//   const handleUpload = async () => {
//     if (!selectedFiles?.length) return;

//     const formData = new FormData();
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append("files", selectedFiles[i]);
//     }
//     if (folderId) {
//       formData.append("folderId", folderId);
//     }

//     try {
//       await api.post("/files/upload", formData, {
//         withCredentials: true,
//         // headers: { "Content-Type": "multipart/form-data" },
//       });
//       onClose();
//     } catch (error) {
//       console.error("Upload failed", error);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Upload Files</DialogTitle>
//         </DialogHeader>
//         <input
//           type="file"
//           ref={inputRef}
//           multiple
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleUpload}>Upload</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
