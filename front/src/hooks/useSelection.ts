import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedIds, setLastSelectedId } from '@/store/fileManagerSlice';

export function useSelection(items: { id: string; type: 'file' | 'folder' }[]) {
  const dispatch = useDispatch();
  const { selectedIds, lastSelectedId } = useSelector((state: RootState) => state.fileManager);

  const handleClick = (e: React.MouseEvent, clickedId: string) => {
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      const newSelected = selectedIds.includes(clickedId)
        ? selectedIds.filter((id) => id !== clickedId)
        : [...selectedIds, clickedId];
      dispatch(setSelectedIds(newSelected));
      dispatch(setLastSelectedId(clickedId));
    } else if (e.shiftKey && lastSelectedId) {
      const startIndex = items.findIndex((i) => i.id === lastSelectedId);
      const endIndex = items.findIndex((i) => i.id === clickedId);
      const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const idsInRange = items.slice(from, to + 1).map((i) => i.id);
      dispatch(setSelectedIds(idsInRange));
    } else {
      dispatch(setSelectedIds([clickedId]));
      dispatch(setLastSelectedId(clickedId));
    }
  };

  return { selectedIds, handleClick };
}
