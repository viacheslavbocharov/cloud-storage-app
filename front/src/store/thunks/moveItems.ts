import { AppThunk } from '@/store';
import api from '@/utils/axios';
import { setFolderContents } from '../fileManagerSlice';

export const moveItems =
  (destinationId: string | null): AppThunk =>
  async (dispatch, getState) => {
    const state = getState().fileManager;

    const dragItems = state.dragItems;

    if (dragItems.length === 0) return;

    try {
      await api.post('/folders/move', {
        items: dragItems,
        destinationId,
      });

      // После перемещения можно обновить содержимое текущей и целевой папки
      const affectedFolders = new Set<string | null>();
      dragItems.forEach((item) => {
        if (item.type === 'file') {
          const fileFolder = Object.entries(state.filesByFolderId).find(
            ([_, files]) => files.some((f) => f._id === item.id),
          );
          if (fileFolder) affectedFolders.add(fileFolder[0]);
        }

        if (item.type === 'folder') {
          const folderParent = Object.entries(state.foldersByParentId).find(
            ([_, folders]) => folders.some((f) => f._id === item.id),
          );
          if (folderParent) affectedFolders.add(folderParent[0]);
        }
      });

      affectedFolders.add(destinationId ?? 'root');

      for (const folderId of affectedFolders) {
        const res = await api.get('/folders/contents', {
          params: { folderId: folderId === 'root' ? null : folderId },
        });

        dispatch(
          setFolderContents({
            parentFolderId: folderId === 'root' ? null : folderId,
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      }
    } catch (error) {
      console.error('Ошибка при переносе:', error);
    }
  };
