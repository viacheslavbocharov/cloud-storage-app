import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  restoreItem,
  setSelectedIds,
  setBinContents,
  setFolderContents,
  setSearchContents,
} from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { Button } from './ui/button';

export function BinToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds, binFiles, binFolders, searchQuery, viewingMode } =
    useSelector((state: RootState) => state.fileManager);

  const handleRestoreSelected = async () => {
    if (selectedIds.length === 0) return;

    const items = selectedIds.map((id) => {
      const isFile = binFiles.find((f) => f._id === id);
      return {
        id,
        type: isFile ? ('file' as const) : ('folder' as const),
      };
    });

    try {
      await api.post('/bin/restore', { items });

      const resBin = await api.get('/bin');
      dispatch(
        setBinContents({
          folders: resBin.data.folders,
          files: resBin.data.files,
        }),
      );

      if (searchQuery && viewingMode === 'bin') {
        const res = await api.get('/search', {
          params: {
            query: searchQuery,
            isDeleted: 'true',
          },
        });
        dispatch(
          setSearchContents({
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      }

      const { loadedFolders } = (await import('@/store')).store.getState()
        .fileManager;

      await Promise.all(
        loadedFolders.map(async (folderId) => {
          const res = await api.get('/folders/contents', {
            params: {
              folderId: folderId === 'root' ? undefined : folderId,
            },
          });

          dispatch(
            setFolderContents({
              parentFolderId: folderId === 'root' ? null : folderId,
              folders: res.data.folders,
              files: res.data.files,
            }),
          );
        }),
      );

      dispatch(setSelectedIds([]));
    } catch (err) {
      console.error('Restore error', err);
    }
  };

  return (
    <div className="flex justify-end py-2">
      <Button
        className="rounded-lg text-sm font-medium shadow-sm cursor-pointer"
        variant="outline"
        disabled={selectedIds.length === 0}
        onClick={handleRestoreSelected}
      >
        Restore Selected
      </Button>
    </div>
  );
}
