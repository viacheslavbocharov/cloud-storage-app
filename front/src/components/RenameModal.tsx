import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRenameItem,
  closeRenameModal,
  updateFileName,
  updateFolderName,
} from '@/store/fileManagerSlice';
import { useState, useEffect } from 'react';
import api from '@/utils/axios';

export function RenameModal() {
  const dispatch = useDispatch();
  const item = useSelector(selectRenameItem);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) setNewName(item.originalName);
  }, [item]);

  // const handleSubmit = async () => {
  //   if (!item) return;
  //   try {
  //     setIsLoading(true);
  //     const res = await api.patch(`/files/${item.id}`, { originalName: newName });
  //     dispatch(updateFileName({ id: item.id, newName }));
  //     dispatch(closeRenameModal());
  //   } catch (err) {
  //     console.error('❌ Rename error:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!item) return;
    setIsLoading(true);

    try {
      if (item.type === 'file') {
        await api.patch(`/files/${item.id}`, { originalName: newName });
        dispatch(updateFileName({ id: item.id, newName }));
      } else if (item.type === 'folder') {
        await api.patch(`/folders/${item.id}`, { name: newName });
        dispatch(updateFolderName({ id: item.id, newName }));
      }

      dispatch(closeRenameModal());
    } catch (err) {
      console.error('❌ Rename error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={() => dispatch(closeRenameModal())}>
      <DialogContent>
        <DialogHeader>Rename {item?.type}</DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isLoading}
        />
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!newName.trim() || isLoading}
          >
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
