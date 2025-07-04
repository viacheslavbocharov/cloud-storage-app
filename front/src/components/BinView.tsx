import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import api from '@/utils/axios';
import { setBinContents } from '@/store/fileManagerSlice';
import { FolderRowBin } from './FolderRowBin';
import { FileRowBin } from './FileRowBin';

export function BinView() {
  const dispatch = useDispatch<AppDispatch>();

  const folders = useSelector(
    (state: RootState) => state.fileManager.binFolders,
  );
  const files = useSelector((state: RootState) => state.fileManager.binFiles);
  const currentPath = useSelector(
    (state: RootState) => state.fileManager.currentPath,
  );

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const folderId =
          currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

        const res = await api.get('/bin', {
          params: {
            folderId: folderId ?? null,
          },
        });

        dispatch(
          setBinContents({ folders: res.data.folders, files: res.data.files }),
        );
      } catch (err) {
        console.error('Failed to load trash:', err);
      }
    };

    fetchTrash();
  }, [dispatch, currentPath]);

  return (
    <div className="flex flex-col gap-2 p-4">
      {folders.map((folder) => (
        <FolderRowBin key={folder._id} item={folder} />
      ))}
      {files.map((file) => (
        <FileRowBin key={file._id} item={file} />
      ))}
      {folders.length === 0 && files.length === 0 && (
        <div className="text-muted-foreground text-sm">Trash is empty</div>
      )}
    </div>
  );
}
