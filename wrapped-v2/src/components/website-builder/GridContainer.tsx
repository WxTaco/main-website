import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import DraggableGridItem from './DraggableGridItem';

interface GridContainerProps {
  components: any[];
  setComponents: React.Dispatch<React.SetStateAction<any[]>>;
  selectedComponent: string | null;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>>;
  getDefaultProps: (type: string) => any;
}

interface ComponentItem {
  type: string;
  name: string;
  id?: string;
  isMoving?: boolean;
}

const GridContainer: React.FC<GridContainerProps> = ({
  components,
  setComponents,
  selectedComponent,
  setSelectedComponent,
  getDefaultProps,
}) => {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  // Filter out navbar and footer components
  const contentComponents = components.filter(
    (component) => component.type !== 'navbar' && component.type !== 'footer'
  );

  // Handle component selection
  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id);
  };

  // Handle component deletion
  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((component) => component.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  // Handle moving items within the grid (horizontal reordering)
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setComponents((prevComponents) => {
        // Get the navbar and footer components
        const navbar = prevComponents.find((comp) => comp.type === 'navbar');
        const footer = prevComponents.find((comp) => comp.type === 'footer');

        // Get content components
        const content = prevComponents.filter(
          (comp) => comp.type !== 'navbar' && comp.type !== 'footer'
        );

        // Get the dragged item
        const draggedItem = content[dragIndex];

        // Create a new array without the dragged item
        const newContent = [...content];
        newContent.splice(dragIndex, 1);

        // Insert the dragged item at the new position
        newContent.splice(hoverIndex, 0, draggedItem);

        // Return the new array with navbar at top, reordered content in middle, footer at bottom
        return [
          ...(navbar ? [navbar] : []),
          ...newContent,
          ...(footer ? [footer] : []),
        ];
      });
    },
    [setComponents]
  );

  // Handle dropping a new component
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: ComponentItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      // If it's a new component being added
      if (!item.isMoving) {
        const newComponent = {
          id: uuidv4(),
          type: item.type,
          props: getDefaultProps(item.type),
        };

        // Add the new component to the grid
        setComponents((prev) => {
          // Filter out navbar and footer to keep them in place
          const navbar = prev.find((comp) => comp.type === 'navbar');
          const footer = prev.find((comp) => comp.type === 'footer');

          // Get content components
          const content = prev.filter(
            (comp) => comp.type !== 'navbar' && comp.type !== 'footer'
          );

          // Determine position to insert based on hovered column
          const position = hoveredColumn !== null ? hoveredColumn : content.length;

          // Insert the new component at the determined position
          content.splice(position, 0, newComponent);

          // Reconstruct the array with navbar at top, content in middle, footer at bottom
          return [
            ...(navbar ? [navbar] : []),
            ...content,
            ...(footer ? [footer] : []),
          ];
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`grid-container w-full min-h-[300px] ${
        isOver ? 'border-2 border-dashed border-theme-primary' : ''
      }`}
    >
      {contentComponents.length === 0 ? (
        <div className="empty-grid flex items-center justify-center h-full text-gray-400 p-8">
          <p>Drag and drop components here</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 grid-flow-row-dense">
          {contentComponents.map((component, index) => (
            <DraggableGridItem
              key={component.id}
              component={component}
              index={index}
              moveItem={moveItem}
              handleSelectComponent={handleSelectComponent}
              handleDeleteComponent={handleDeleteComponent}
              selectedComponent={selectedComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GridContainer;
