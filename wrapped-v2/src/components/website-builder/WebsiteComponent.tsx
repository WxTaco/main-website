import React from 'react';

// Import the dummy export
import type { WebsiteComponentProps } from './componentTypes';

// Base interface for all website components - defined as a type but not exported
// @ts-ignore
/** @typedef {Object} WebsiteComponentProps
 * @property {string} id
 * @property {string} type
 * @property {string} [content]
 * @property {React.ReactNode} [children]
 * @property {React.CSSProperties} [style]
 * @property {string} [className]
 * @property {(id: string) => void} [onEdit]
 * @property {(id: string) => void} [onDelete]
 * @property {boolean} [isSelected]
 */

// The base component that all other components will extend
const WebsiteComponent: React.FC<WebsiteComponentProps> = ({
  id,
  type,
  content,
  children,
  style,
  className,
  onEdit,
  onDelete,
  isSelected,
}) => {
  // Special styling for navbar and footer when selected
  const getSelectionStyle = () => {
    if (!isSelected) return '';

    if (type === 'navbar' || type === 'footer') {
      return 'outline outline-4 outline-theme-primary/70 outline-offset-2';
    }

    return 'outline outline-2 outline-theme-primary';
  };

  // Determine if this is a container component
  const isContainer = type === 'container';

  // Add additional styles for containers to ensure they take full width
  const combinedStyle = {
    ...style,
    width: isContainer ? '100%' : style?.width,
    boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
  };

  return (
    <div
      className={`relative ${className} ${getSelectionStyle()} ${isContainer ? 'w-full' : ''}`}
      style={combinedStyle}
    >
      {isSelected && (
        <div className="absolute -top-8 right-0 flex space-x-1 bg-gray-900 rounded-t-md p-1 z-10">
          <button
            onClick={() => onEdit && onEdit(id)}
            className="p-1 text-white hover:text-theme-primary"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="p-1 text-white hover:text-red-500"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
      <div className={isContainer ? 'w-full' : ''}>
        {children || content}
      </div>
    </div>
  );
};

export default WebsiteComponent;
