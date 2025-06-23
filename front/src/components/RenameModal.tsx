import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectRenameItem, closeRenameModal, updateFileName } from '@/store/fileManagerSlice';
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

  const handleSubmit = async () => {
    if (!item) return;
    try {
      setIsLoading(true);
      const res = await api.patch(`/files/${item.id}`, { originalName: newName });
      dispatch(updateFileName({ id: item.id, newName }));
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
          <Button onClick={handleSubmit} disabled={!newName.trim() || isLoading}>
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
