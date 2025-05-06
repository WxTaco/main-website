import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import WebsiteComponent from './WebsiteComponent';
import { ContainerComponentProps as _ContainerComponentProps } from './componentTypes';
import { renderComponent } from './ComponentRegistry';
import ResizableContainer from './ResizableContainer';

// @ts-ignore
/** @typedef {Object} ContainerComponentProps
 * @property {string} id
 * @property {string} type
 * @property {string} [content]
 * @property {React.ReactNode} [children]
 * @property {React.CSSProperties} [style]
 * @property {string} [className]
 * @property {(id: string) => void} [onEdit]
 * @property {(id: string) => void} [onDelete]
 * @property {boolean} [isSelected]
 * @property {string} [backgroundColor]
 * @property {string} [padding]
 * @property {string} [margin]
 * @property {string} [width]
 * @property {number} [columns]
 * @property {string} [gap]
 * @property {string} [borderRadius]
 * @property {string} [borderWidth]
 * @property {string} [borderColor]
 * @property {string} [borderStyle]
 * @property {string} [boxShadow]
 * @property {any[]} [childComponents]
 * @property {(containerId: string, component: any) => void} [onAddChild]
 */

const ContainerComponent: React.FC<ContainerComponentProps> = ({
  id,
  backgroundColor = 'rgba(31, 41, 55, 0.7)',
  padding = '1rem',
  margin = '1rem 0',
  width = '100%',
  height = 'auto',
  columns = 1,
  gap = '1rem',
  borderRadius = '0.5rem',
  borderWidth = '0',
  borderColor = 'rgba(75, 85, 99, 0.5)',
  borderStyle = 'solid',
  boxShadow = 'none',
  gridColumnSpan = 3,
  gridRowSpan = 1,
  children,
  childComponents = [],
  onEdit,
  onDelete,
  isSelected,
  onAddChild,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up drop functionality for the container
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: (item: any, monitor) => {
      // Prevent drop if already handled by a child
      if (monitor.didDrop()) {
        return;
      }

      // If it's a new component being added
      if (!item.isMoving && onAddChild) {
        const newComponent = {
          id: uuidv4(),
          type: item.type,
          props: getDefaultProps(item.type),
        };

        // Add the new component to this container
        onAddChild(id, newComponent);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Get default props based on component type
  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'text':
        return {
          text: 'This is a text component. Click to edit.',
          variant: 'paragraph',
          alignment: 'left',
          fontFamily: 'default',
          fontSize: 'medium',
          fontWeight: 'normal',
          color: 'inherit',
          verticalAlign: 'top',
          horizontalAlign: 'left',
        };
      case 'button':
        return {
          text: 'Click Me',
          url: '#',
          variant: 'primary',
          size: 'medium',
          action: 'link',
          target: '_self',
          verticalAlign: 'top',
          horizontalAlign: 'left',
        };
      default:
        return {};
    }
  };

  // Create container style
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    margin: '0',
    // Force full width
    width: '100%',
    minWidth: '100%',
    minHeight: gridRowSpan > 0 ? `${gridRowSpan * 100}px` : '100px',
    borderRadius,
    borderWidth,
    borderColor,
    borderStyle,
    boxShadow,
    position: 'relative',
    boxSizing: 'border-box',
  };

  // Log the container style for debugging
  console.log('Container style:', containerStyle, 'gridColumnSpan:', gridColumnSpan, 'gridRowSpan:', gridRowSpan);

  // Create grid style for child components
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    width: '100%',
  };

  // Initialize the drop ref
  drop(containerRef);

  // Handle container resizing
  const handleResize = (width: number, height: number) => {
    // This function is called during the resize operation
    // Update the container style in real-time
    if (containerRef.current) {
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;
    }
  };

  // Handle container resize end
  const handleResizeEnd = (newGridColumnSpan: number, newGridRowSpan: number) => {
    // Update the container's grid spans when resizing ends
    if (onEdit) {
      // Call onEdit to select the component
      onEdit(id);

      // Get the current props from the parent component
      const updatedProps = {
        backgroundColor,
        padding,
        margin,
        width,
        height,
        columns,
        gap,
        borderRadius,
        borderWidth,
        borderColor,
        borderStyle,
        boxShadow,
        gridColumnSpan: newGridColumnSpan,
        gridRowSpan: newGridRowSpan,
      };

      // Log the updated props for debugging
      console.log('Container resize end:', id, updatedProps);

      // Update the component's props through the parent component's handler
      if (window.updateComponentProps) {
        window.updateComponentProps(id, updatedProps);
      } else {
        console.error('window.updateComponentProps is not defined');
        // Fallback: directly update the component style
        if (containerRef.current) {
          containerRef.current.style.width = `${newGridColumnSpan * 100 / 12}%`;
          containerRef.current.style.height = `${newGridRowSpan * 100}px`;
        }
      }
    }
  };

  return (
    <WebsiteComponent
      id={id}
      type="container"
      style={containerStyle}
      className={`border border-gray-700/30 ${isOver && canDrop ? 'outline outline-2 outline-theme-primary/50' : ''}`}
      onEdit={onEdit}
      onDelete={onDelete}
      isSelected={isSelected}
    >
      <ResizableContainer
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        gridColumnSpan={gridColumnSpan}
        gridRowSpan={gridRowSpan}
        isSelected={isSelected}
      >
        <div
          ref={containerRef}
          className="container-content min-h-[100px] w-full"
          style={{
            minWidth: '100%',
            minHeight: gridRowSpan > 0 ? `${gridRowSpan * 100}px` : '100px'
          }}
        >
          {childComponents && childComponents.length > 0 ? (
            <div style={gridStyle} className="w-full">
              {childComponents.map((component) =>
                renderComponent(
                  component,
                  onEdit,
                  onDelete,
                  isSelected === component.id
                )
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-400 h-full w-full">
              <p>Container - Drag components here</p>
            </div>
          )}
        </div>
      </ResizableContainer>
    </WebsiteComponent>
  );
};

export default ContainerComponent;
