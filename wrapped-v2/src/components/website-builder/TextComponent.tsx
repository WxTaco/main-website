import React from 'react';
import WebsiteComponent from './WebsiteComponent';
import { TextComponentProps as _TextComponentProps } from './componentTypes';

// @ts-ignore
/** @typedef {Object} TextComponentProps
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
 * @property {'heading1'|'heading2'|'heading3'|'paragraph'|'custom'} [variant]
 * @property {'left'|'center'|'right'|'justify'} [alignment]
 * @property {'default'|'sans'|'serif'|'mono'|'saira'} [fontFamily]
 * @property {'small'|'medium'|'large'|'xlarge'|'custom'} [fontSize]
 * @property {string} [customFontSize]
 * @property {'normal'|'medium'|'semibold'|'bold'} [fontWeight]
 * @property {'normal'|'italic'} [fontStyle]
 * @property {'none'|'underline'|'line-through'} [textDecoration]
 * @property {string} [color]
 * @property {'normal'|'tight'|'relaxed'|'loose'} [lineHeight]
 * @property {'normal'|'wide'|'wider'|'widest'} [letterSpacing]
 * @property {'top'|'middle'|'bottom'} [verticalAlign]
 * @property {'left'|'center'|'right'} [horizontalAlign]
 * @property {string} [margin]
 * @property {string} [padding]
 */

const TextComponent: React.FC<TextComponentProps> = ({
  id,
  text = 'Text content goes here',
  variant = 'paragraph',
  alignment = 'left',
  fontFamily = 'default',
  fontSize = 'medium',
  customFontSize = '',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecoration = 'none',
  color = 'inherit',
  lineHeight = 'normal',
  letterSpacing = 'normal',
  verticalAlign = 'top',
  horizontalAlign = 'left',
  margin = '0',
  padding = '0',
  onEdit,
  onDelete,
  isSelected,
}) => {
  // Define text styles based on variant and other properties
  const getTextClasses = () => {
    let classes = '';

    // Variant styles
    if (variant === 'heading1') {
      classes += 'text-4xl font-saira font-bold text-theme-primary mb-4';
    } else if (variant === 'heading2') {
      classes += 'text-3xl font-saira font-semibold text-theme-primary mb-3';
    } else if (variant === 'heading3') {
      classes += 'text-2xl font-saira font-medium text-theme-primary mb-2';
    } else if (variant === 'paragraph') {
      classes += 'text-base text-gray-200 mb-4';
    } else {
      // Custom styling will be applied via inline styles
      classes += 'mb-4';
    }

    // Alignment styles
    if (alignment === 'left') {
      classes += ' text-left';
    } else if (alignment === 'center') {
      classes += ' text-center';
    } else if (alignment === 'right') {
      classes += ' text-right';
    } else if (alignment === 'justify') {
      classes += ' text-justify';
    }

    return classes;
  };

  // Create custom styles for the text
  const getCustomStyles = (): React.CSSProperties => {
    if (variant !== 'custom') {
      return { margin, padding };
    }

    const styles: React.CSSProperties = {
      margin,
      padding,
    };

    // Font family
    if (fontFamily === 'sans') {
      styles.fontFamily = 'ui-sans-serif, system-ui, sans-serif';
    } else if (fontFamily === 'serif') {
      styles.fontFamily = 'ui-serif, Georgia, serif';
    } else if (fontFamily === 'mono') {
      styles.fontFamily = 'ui-monospace, monospace';
    } else if (fontFamily === 'saira') {
      styles.fontFamily = 'Saira, sans-serif';
    }

    // Font size
    if (fontSize === 'small') {
      styles.fontSize = '0.875rem';
    } else if (fontSize === 'medium') {
      styles.fontSize = '1rem';
    } else if (fontSize === 'large') {
      styles.fontSize = '1.25rem';
    } else if (fontSize === 'xlarge') {
      styles.fontSize = '1.5rem';
    } else if (fontSize === 'custom' && customFontSize) {
      styles.fontSize = customFontSize;
    }

    // Font weight
    if (fontWeight === 'normal') {
      styles.fontWeight = '400';
    } else if (fontWeight === 'medium') {
      styles.fontWeight = '500';
    } else if (fontWeight === 'semibold') {
      styles.fontWeight = '600';
    } else if (fontWeight === 'bold') {
      styles.fontWeight = '700';
    }

    // Font style
    if (fontStyle === 'italic') {
      styles.fontStyle = 'italic';
    }

    // Text decoration
    if (textDecoration === 'underline') {
      styles.textDecoration = 'underline';
    } else if (textDecoration === 'line-through') {
      styles.textDecoration = 'line-through';
    }

    // Color
    if (color !== 'inherit') {
      styles.color = color;
    }

    // Line height
    if (lineHeight === 'tight') {
      styles.lineHeight = '1.25';
    } else if (lineHeight === 'relaxed') {
      styles.lineHeight = '1.625';
    } else if (lineHeight === 'loose') {
      styles.lineHeight = '2';
    }

    // Letter spacing
    if (letterSpacing === 'wide') {
      styles.letterSpacing = '0.025em';
    } else if (letterSpacing === 'wider') {
      styles.letterSpacing = '0.05em';
    } else if (letterSpacing === 'widest') {
      styles.letterSpacing = '0.1em';
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

  const renderText = () => {
    const className = getTextClasses();
    const customStyles = getCustomStyles();

    if (variant === 'heading1') {
      return <h1 className={className} style={customStyles}>{text}</h1>;
    } else if (variant === 'heading2') {
      return <h2 className={className} style={customStyles}>{text}</h2>;
    } else if (variant === 'heading3') {
      return <h3 className={className} style={customStyles}>{text}</h3>;
    } else if (variant === 'custom') {
      return <p className={className} style={customStyles}>{text}</p>;
    } else {
      return <p className={className} style={customStyles}>{text}</p>;
    }
  };

  return (
    <WebsiteComponent
      id={id}
      type="text"
      style={getContainerStyles()}
      onEdit={onEdit}
      onDelete={onDelete}
      isSelected={isSelected}
    >
      {renderText()}
    </WebsiteComponent>
  );
};

export default TextComponent;
