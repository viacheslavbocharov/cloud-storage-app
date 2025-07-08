// import { Input } from "@/components/ui/input"
// import { Search } from "lucide-react"

// export function SearchInput() {
//   return (
//     <div className="relative w-full max-w-sm">
//       <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
//       <Input
//         type="text"
//         placeholder="Search the docs..."
//         className="pl-10 rounded-lg"
//       />
//     </div>
//   )
// }

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useState, useEffect } from 'react';
import {
  setBinContents,
  setFolderContents,
  setSearchContents,
  setSearchQuery,
} from '@/store/fileManagerSlice';
import api from '@/utils/axios';
import { Button } from '@/components/ui/button';

export function SearchInput() {
  const dispatch = useDispatch<AppDispatch>();
  const { viewingMode, searchQuery } = useSelector(
    (state: RootState) => state.fileManager,
  );

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      setQuery('');
    }
  }, [searchQuery]);

  const placeholder =
    viewingMode === 'bin'
      ? 'To search in Bin enter min 3 symbols'
      : 'To search in My Drive enter min 3 symbols';

  // При очистке возвращаем в исходное состояние
  const clearSearch = async () => {
    setQuery('');
    dispatch(setSearchQuery(''));
    // dispatch(setViewingMode('normal'));

    try {
      if (viewingMode === 'bin') {
        // Перезагружаем корзину
        const res = await api.get('/bin');
        dispatch(
          setBinContents({
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      } else {
        // Перезагружаем корень
        const res = await api.get('/folders/contents');
        dispatch(
          setFolderContents({
            parentFolderId: null,
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
      }
    } catch (err) {
      console.error('Error during clearing search', err);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      dispatch(setSearchQuery(''));
      dispatch(setSearchContents({ folders: [], files: [] }));
      return;
    }

    try {
      if (viewingMode === 'bin') {
        // Поиск по корзине
        const res = await api.get('/search', {
          params: {
            query: value,
            isDeleted: 'true',
          },
        });

        dispatch(
          setSearchContents({
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
        dispatch(setSearchQuery(value));
      } else {
        // Поиск по My Drive
        const res = await api.get('/search', {
          params: {
            query: value,
            isDeleted: 'false',
          },
        });

        dispatch(
          setSearchContents({
            folders: res.data.folders,
            files: res.data.files,
          }),
        );
        dispatch(setSearchQuery(value));
      }
    } catch (err) {
      console.error('Error during search', err);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10 rounded-lg"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
