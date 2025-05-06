import React from 'react';
import WebsiteComponent from './WebsiteComponent';
import { ButtonComponentProps as _ButtonComponentProps } from './componentTypes';

// @ts-ignore
/** @typedef {Object} ButtonComponentProps
 * @property {string} id
 * @property {string} type
 * @property {string} [content]
 * @property {React.ReactNode} [children]
 * @property {React.CSSProperties} [style]
 * @property {string} [className]
 * @property {(id: string) => void} [onEdit]
 * @property {(id: string) => void} [onDelete]
 * @property {boolean} [isSelected]
 * @property {string} [text]
 * @property {string} [url]
 * @property {'primary'|'secondary'|'outline'|'ghost'|'custom'} [variant]
 * @property {'small'|'medium'|'large'} [size]
 * @property {'link'|'scroll'|'modal'|'form'|'download'} [action]
 * @property {'_self'|'_blank'|'_parent'|'_top'} [target]
 * @property {string} [scrollTarget]
 * @property {string} [modalContent]
 * @property {string} [formAction]
 * @property {string} [downloadUrl]
 * @property {string} [downloadFilename]
 * @property {'left'|'right'|'none'} [iconPosition]
 * @property {string} [icon]
 * @property {string} [borderRadius]
 * @property {string} [backgroundColor]
 * @property {string} [textColor]
 * @property {string} [borderColor]
 * @property {string} [hoverBackgroundColor]
 * @property {string} [hoverTextColor]
 * @property {string} [hoverBorderColor]
 * @property {'top'|'middle'|'bottom'} [verticalAlign]
 * @property {'left'|'center'|'right'} [horizontalAlign]
 * @property {string} [margin]
 * @property {string} [padding]
 * @property {string} [width]
 */

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  id,
  text = 'Button',
  url = '#',
  variant = 'primary',
  size = 'medium',
  action = 'link',
  target = '_self',
  scrollTarget = '',
  modalContent = '',
  formAction = '',
  downloadUrl = '',
  downloadFilename = '',
  iconPosition = 'none',
  icon = '',
  borderRadius = '',
  backgroundColor = '',
  textColor = '',
  borderColor = '',
  hoverBackgroundColor = '',
  hoverTextColor = '',
  hoverBorderColor = '',
  verticalAlign = 'top',
  horizontalAlign = 'left',
  margin = '0',
  padding = '',
  width = 'auto',
  onEdit,
  onDelete,
  isSelected,
}) => {
  // Define button styles based on variant and size
  const getButtonClasses = () => {
    let classes = 'inline-flex items-center justify-center transition-colors duration-200 font-medium';

    // Variant styles
    if (variant === 'primary') {
      classes += ' bg-theme-primary hover:bg-theme-primary/80 text-white';
    } else if (variant === 'secondary') {
      classes += ' bg-gray-700 hover:bg-gray-600 text-white';
    } else if (variant === 'outline') {
      classes += ' bg-transparent border border-theme-primary text-theme-primary hover:bg-theme-primary/10';
    } else if (variant === 'ghost') {
      classes += ' bg-transparent text-theme-primary hover:bg-theme-primary/10';
    }

    // Size styles
    if (size === 'small') {
      classes += ' text-sm px-3 py-1';
    } else if (size === 'medium') {
      classes += ' px-4 py-2';
    } else if (size === 'large') {
      classes += ' text-lg px-6 py-3';
    }

    // Border radius
    if (!borderRadius) {
      classes += ' rounded-md';
    }

    return classes;
  };

  // Get custom styles for the button
  const getCustomStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      margin,
      width,
    };

    if (variant === 'custom') {
      styles.backgroundColor = backgroundColor || 'transparent';
      styles.color = textColor || 'inherit';
      styles.borderColor = borderColor || 'transparent';

      if (borderColor) {
        styles.borderWidth = '1px';
        styles.borderStyle = 'solid';
      }
    }

    if (borderRadius) {
      styles.borderRadius = borderRadius;
    }

    if (padding) {
      styles.padding = padding;
    }

    return styles;
  };

  // Get container styles for alignment
  const getContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'flex',
    };

    // Vertical alignment
    if (verticalAlign === 'top') {
      styles.alignItems = 'flex-start';
    } else if (verticalAlign === 'middle') {
      styles.alignItems = 'center';
    } else if (verticalAlign === 'bottom') {
      styles.alignItems = 'flex-end';
    }

    // Horizontal alignment
    if (horizontalAlign === 'left') {
      styles.justifyContent = 'flex-start';
    } else if (horizontalAlign === 'center') {
      styles.justifyContent = 'center';
    } else if (horizontalAlign === 'right') {
      styles.justifyContent = 'flex-end';
    }

    return styles;
  };

  // Handle button click based on action type
  const handleButtonClick = (e: React.MouseEvent) => {
    if (action === 'scroll' && scrollTarget) {
      e.preventDefault();
      const targetElement = document.getElementById(scrollTarget);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'modal' && modalContent) {
      e.preventDefault();
      // Show modal with content
      alert(modalContent); // Placeholder for actual modal implementation
    }
  };

  // Render button based on action type
  const renderButton = () => {
    const buttonClasses = getButtonClasses();
    const customStyles = getCustomStyles();

    // Render icon if specified
    const renderIcon = () => {
      if (icon && iconPosition !== 'none') {
        return (
          <span className={`icon ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
            <i className={icon}></i>
          </span>
        );
      }
      return null;
    };

    if (action === 'download' && downloadUrl) {
      return (
        <a
          href={downloadUrl}
          download={downloadFilename}
          className={buttonClasses}
          style={customStyles}
          onClick={handleButtonClick}
        >
          {iconPosition === 'left' && renderIcon()}
          {text}
          {iconPosition === 'right' && renderIcon()}
        </a>
      );
    } else if (action === 'form' && formAction) {
      return (
        <button
          type="submit"
          form={formAction}
          className={buttonClasses}
          style={customStyles}
        >
          {iconPosition === 'left' && renderIcon()}
          {text}
          {iconPosition === 'right' && renderIcon()}
        </button>
      );
    } else {
      return (
        <a
          href={url}
          target={target}
          className={buttonClasses}
          style={customStyles}
          onClick={handleButtonClick}
        >
          {iconPosition === 'left' && renderIcon()}
          {text}
          {iconPosition === 'right' && renderIcon()}
        </a>
      );
    }
  };

  return (
    <WebsiteComponent
      id={id}
      type="button"
      style={getContainerStyles()}
      onEdit={onEdit}
      onDelete={onDelete}
      isSelected={isSelected}
    >
      {renderButton()}
    </WebsiteComponent>
  );
};

export default ButtonComponent;
