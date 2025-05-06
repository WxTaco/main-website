import React, { useState, useRef, useEffect } from 'react';

interface ResizableContainerProps {
  children: React.ReactNode;
  onResize: (width: number, height: number) => void;
  onResizeEnd: (gridColumnSpan: number, gridRowSpan: number) => void;
  gridColumnSpan: number;
  gridRowSpan: number;
  isSelected: boolean;
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({
  children,
  onResize,
  onResizeEnd,
  gridColumnSpan,
  gridRowSpan,
  isSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState<'none' | 'horizontal' | 'vertical' | 'both'>('none');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });

  // Calculate grid cell size
  const calculateGridCellSize = () => {
    if (!containerRef.current) return { width: 0, height: 0 };

    // Get the parent container's width to calculate the grid cell width
    const parentWidth = containerRef.current.parentElement?.offsetWidth || containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate the width of a single grid column (out of 12 columns)
    const gridColumnWidth = parentWidth / 12;

    // Calculate the height of a single grid row (assuming 100px per row)
    const gridRowHeight = 100;

    console.log('Grid cell calculation:', {
      parentWidth,
      containerHeight,
      gridColumnWidth,
      gridRowHeight
    });

    return {
      width: gridColumnWidth,
      height: gridRowHeight,
    };
  };

  // Start resize
  const handleResizeStart = (
    e: React.MouseEvent,
    direction: 'horizontal' | 'vertical' | 'both'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;

    setResizing(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    setCurrentSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (resizing === 'none' || !containerRef.current) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;

    if (resizing === 'horizontal' || resizing === 'both') {
      newWidth = Math.max(100, startSize.width + deltaX);

      // Apply the new width to the container in real-time
      if (containerRef.current) {
        // Set a fixed width during resize to override any percentage-based width
        containerRef.current.style.width = `${newWidth}px`;

        // Also set min-width to ensure content doesn't overflow
        containerRef.current.style.minWidth = `${newWidth}px`;

        // Ensure the parent element is also wide enough
        if (containerRef.current.parentElement) {
          containerRef.current.parentElement.style.width = `${newWidth}px`;
          containerRef.current.parentElement.style.minWidth = `${newWidth}px`;
        }
      }
    }

    if (resizing === 'vertical' || resizing === 'both') {
      newHeight = Math.max(50, startSize.height + deltaY);

      // Apply the new height to the container in real-time
      if (containerRef.current) {
        containerRef.current.style.height = `${newHeight}px`;
        containerRef.current.style.minHeight = `${newHeight}px`;

        // Ensure the parent element is also tall enough
        if (containerRef.current.parentElement) {
          containerRef.current.parentElement.style.height = `${newHeight}px`;
          containerRef.current.parentElement.style.minHeight = `${newHeight}px`;
        }
      }
    }

    setCurrentSize({ width: newWidth, height: newHeight });
    onResize(newWidth, newHeight);
  };

  // End resize
  const handleResizeEnd = () => {
    if (resizing === 'none') return;

    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);

    const cellSize = calculateGridCellSize();

    // Calculate new grid spans based on the new size
    const newGridColumnSpan = Math.max(1, Math.min(12, Math.round(currentSize.width / cellSize.width)));
    const newGridRowSpan = Math.max(1, Math.min(6, Math.round(currentSize.height / cellSize.height)));

    console.log('Resize end - new spans:', newGridColumnSpan, newGridRowSpan);
    console.log('Current size:', currentSize);
    console.log('Cell size:', cellSize);

    // Call the onResizeEnd callback with the new grid spans
    onResizeEnd(newGridColumnSpan, newGridRowSpan);
    setResizing('none');
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full group"
      style={{
        minWidth: '100%',
        minHeight: gridRowSpan > 0 ? `${gridRowSpan * 100}px` : '100px'
      }}
    >
      {children}

      {/* Always show resize handles when selected */}
      {isSelected && (
        <>
          {/* Right resize handle */}
          <div
            className="absolute top-1/2 right-0 w-4 h-24 bg-theme-primary cursor-ew-resize transform -translate-y-1/2 translate-x-1/2 rounded-md opacity-80 hover:opacity-100 transition-opacity hover:bg-theme-primary z-50"
            onMouseDown={(e) => handleResizeStart(e, 'horizontal')}
          />

          {/* Bottom resize handle */}
          <div
            className="absolute bottom-0 left-1/2 h-4 w-24 bg-theme-primary cursor-ns-resize transform -translate-x-1/2 translate-y-1/2 rounded-md opacity-80 hover:opacity-100 transition-opacity hover:bg-theme-primary z-50"
            onMouseDown={(e) => handleResizeStart(e, 'vertical')}
          />

          {/* Corner resize handle */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 bg-theme-primary cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 rounded-md opacity-80 hover:opacity-100 transition-opacity hover:bg-theme-primary shadow-md z-50"
            onMouseDown={(e) => handleResizeStart(e, 'both')}
          />

          {/* Resize indicator */}
          <div className="absolute top-0 right-0 bg-theme-primary text-white text-xs px-2 py-1 rounded-bl-md opacity-100 transition-opacity z-50">
            Resize
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableContainer;
