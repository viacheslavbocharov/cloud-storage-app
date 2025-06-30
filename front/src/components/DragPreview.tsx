import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function DragPreview() {
  const dragItems = useSelector((state: RootState) => state.fileManager.dragItems);

  if (!dragItems.length) return null;

  return (
    <div
      style={{
        padding: '4px 8px',
        fontSize: 14,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: 6,
        boxShadow: '0 0 6px rgba(0,0,0,0.2)',
        display: 'inline-flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      📁 {dragItems.length} item{dragItems.length > 1 ? 's' : ''}
    </div>
  );
}
