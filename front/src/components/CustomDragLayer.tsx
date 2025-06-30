import { useDragLayer } from 'react-dnd';
import { DragPreview } from './DragPreview';

export function CustomDragLayer() {
  const { isDragging, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset) return null;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        top: 0,
        left: 0,
        zIndex: 9999,
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      <DragPreview />
    </div>
  );
}
