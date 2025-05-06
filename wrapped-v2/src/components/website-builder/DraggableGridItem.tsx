import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderComponent } from './ComponentRegistry';

interface DraggableGridItemProps {
  component: any;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleSelectComponent: (id: string) => void;
  handleDeleteComponent: (id: string) => void;
  selectedComponent: string | null;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableGridItem: React.FC<DraggableGridItemProps> = ({
  component,
  index,
  moveItem,
  handleSelectComponent,
  handleDeleteComponent,
  selectedComponent,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Set up drag
  const [{ isDragging }, drag] = useDrag({
    type: 'grid-item',
    item: { index, id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => component.type !== 'navbar' && component.type !== 'footer',
  });

  // Set up drop
  const [{ handlerId, isOver }, drop] = useDrop<{ handlerId: string }, void, { handlerId: string; isOver: boolean }>(
    () => ({
      accept: 'grid-item',
      collect: (monitor) => ({
        handlerId: monitor.getHandlerId() as string,
        isOver: !!monitor.isOver(),
      }),
      hover: (item: unknown, monitor) => {
        const dragItem = item as DragItem;
        if (!ref.current) {
          return;
        }

        const dragIndex = dragItem.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Get rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();

        // Get horizontal middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

        // Get mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the left
        const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

        // Only perform the move when the mouse has crossed half of the item's width
        // Dragging left to right
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }

        // Dragging right to left
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }

        // Time to actually perform the action
        moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        dragItem.index = hoverIndex;
      },
    }),
  );

  // Initialize drag and drop refs
  drag(drop(ref));

  // Apply styles for dragging state
  const opacity = isDragging ? 0.5 : 1;

  // Determine grid column span based on component properties
  const getGridColumnClass = () => {
    // Only apply custom grid spans to container components
    if (component.type === 'container' && component.props && component.props.gridColumnSpan) {
      // Use the gridColumnSpan property to determine the column span
      const span = Math.max(1, Math.min(component.props.gridColumnSpan, 12));
      console.log('Container column span:', span, component.id);
      return `col-span-${span}`;
    }
    // Default grid spans for non-container components
    return 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3';
  };

  // Determine grid row span based on component properties
  const getGridRowClass = () => {
    // Only apply custom grid spans to container components
    if (component.type === 'container' && component.props && component.props.gridRowSpan) {
      // Use the gridRowSpan property to determine the row span
      const span = Math.max(1, Math.min(component.props.gridRowSpan, 6));
      console.log('Container row span:', span, component.id);
      return `row-span-${span}`;
    }
    return '';
  };

  // Get the width style for the container based on grid column span
  const getWidthStyle = () => {
    if (component.type === 'container' && component.props && component.props.gridColumnSpan) {
      // For containers, we want to ensure they take up the full width of their grid cells
      return { width: '100%', opacity };
    }
    return { opacity };
  };

  return (
    <div
      ref={ref}
      className={`${getGridColumnClass()} ${getGridRowClass()} relative ${
        isOver ? 'border-2 border-dashed border-theme-primary' : ''
      }`}
      style={getWidthStyle()}
      data-handler-id={handlerId}
    >
      <div className="relative group w-full">
        {component.type !== 'navbar' && component.type !== 'footer' && (
          <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-theme-primary text-white rounded-full p-1 hover:bg-theme-primary/80 transition-colors"
              onClick={() => handleDeleteComponent(component.id)}
              title="Delete component"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {renderComponent(
          component,
          handleSelectComponent,
          handleDeleteComponent,
          selectedComponent === component.id
        )}
      </div>
    </div>
  );
};

export default DraggableGridItem;
