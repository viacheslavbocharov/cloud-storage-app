import api from '@/utils/axios';
import { AppDispatch } from '@/store';
import { setSearchContents } from '@/store/fileManagerSlice';

export async function refreshSearchResults(
  dispatch: AppDispatch,
  query: string,
  viewingMode: 'normal' | 'bin'
) {
  if (!query || query.length < 3) return;

  try {
    const res = await api.get('/search', {
      params: {
        query,
        isDeleted: viewingMode === 'bin' ? 'true' : 'false',
      },
    });

    dispatch(
      setSearchContents({
        folders: res.data.folders,
        files: res.data.files,
      }),
    );
  } catch (err) {
    console.error('Error refreshing search results', err);
  }
}
