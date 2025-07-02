import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setViewingMode, setCurrentPath, setSelectedIds } from '@/store/fileManagerSlice';


export function BinButton() {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    dispatch(setCurrentPath([]));
    dispatch(setViewingMode('trash'));
    dispatch(setSelectedIds([]));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-0 py-1 text-base hover:opacity-80 cursor-pointer"
    >
      <Trash2 className="h-4 w-4" />
      <span>Bin</span>
    </button>
  );
}
