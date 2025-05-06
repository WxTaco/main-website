import React from 'react';
import ColorPickerPopup from '../ColorPickerPopup';
import ToggleSwitch from './ToggleSwitch';

interface PropertyEditorProps {
  selectedComponent: any;
  onUpdateComponent: (id: string, props: any) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  selectedComponent,
  onUpdateComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="text-gray-400 text-center p-4">
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [key]: value,
    });
  };

  // Render different property editors based on component type
  const renderPropertyEditor = () => {
    switch (selectedComponent.type) {
      case 'text':
        return renderTextEditor();
      case 'button':
        return renderButtonEditor();
      case 'container':
        return renderContainerEditor();
      case 'navbar':
        return renderNavbarEditor();
      case 'footer':
        return renderFooterEditor();
      default:
        return (
          <div className="text-gray-400 text-center p-4">
            <p>No properties available for this component</p>
          </div>
        );
    }
  };

  // Text component editor
  const renderTextEditor = () => {
    const {
      text,
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
      padding = '0'
    } = selectedComponent.props;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Text Content</label>
          <textarea
            value={text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Text Style</label>
          <select
            value={variant}
            onChange={(e) => handleChange('variant', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="heading1">Heading 1</option>
            <option value="heading2">Heading 2</option>
            <option value="heading3">Heading 3</option>
            <option value="paragraph">Paragraph</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {variant === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="default">Default</option>
                <option value="sans">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
                <option value="saira">Saira</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {fontSize === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Custom Font Size</label>
                <input
                  type="text"
                  value={customFontSize}
                  onChange={(e) => handleChange('customFontSize', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="e.g., 1.125rem or 18px"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Font Weight</label>
              <select
                value={fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Font Style</label>
              <select
                value={fontStyle}
                onChange={(e) => handleChange('fontStyle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Text Decoration</label>
              <select
                value={textDecoration}
                onChange={(e) => handleChange('textDecoration', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line Through</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Text Color</label>
              <ColorPickerPopup
                color={color}
                onChange={(color) => handleChange('color', color)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Line Height</label>
              <select
                value={lineHeight}
                onChange={(e) => handleChange('lineHeight', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="normal">Normal</option>
                <option value="tight">Tight</option>
                <option value="relaxed">Relaxed</option>
                <option value="loose">Loose</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Letter Spacing</label>
              <select
                value={letterSpacing}
                onChange={(e) => handleChange('letterSpacing', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="normal">Normal</option>
                <option value="wide">Wide</option>
                <option value="wider">Wider</option>
                <option value="widest">Widest</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Text Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('alignment', 'left')}
              className={`px-3 py-1 rounded-md ${alignment === 'left' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => handleChange('alignment', 'center')}
              className={`px-3 py-1 rounded-md ${alignment === 'center' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => handleChange('alignment', 'right')}
              className={`px-3 py-1 rounded-md ${alignment === 'right' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Right
            </button>
            <button
              type="button"
              onClick={() => handleChange('alignment', 'justify')}
              className={`px-3 py-1 rounded-md ${alignment === 'justify' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Justify
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Vertical Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'top')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'top' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'middle')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'middle' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Middle
            </button>
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'bottom')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'bottom' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Bottom
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Horizontal Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'left')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'left' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'center')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'center' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'right')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'right' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Right
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Margin</label>
            <input
              type="text"
              value={margin}
              onChange={(e) => handleChange('margin', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Padding</label>
            <input
              type="text"
              value={padding}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    );
  };

  // Button component editor
  const renderButtonEditor = () => {
    const {
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
      width = 'auto'
    } = selectedComponent.props;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Button Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Button Action</label>
          <select
            value={action}
            onChange={(e) => handleChange('action', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="link">Link</option>
            <option value="scroll">Scroll to Section</option>
            <option value="modal">Open Modal</option>
            <option value="form">Submit Form</option>
            <option value="download">Download File</option>
          </select>
        </div>

        {action === 'link' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target</label>
              <select
                value={target}
                onChange={(e) => handleChange('target', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
                <option value="_parent">Parent Frame</option>
                <option value="_top">Full Window</option>
              </select>
            </div>
          </>
        )}

        {action === 'scroll' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Scroll Target ID</label>
            <input
              type="text"
              value={scrollTarget}
              onChange={(e) => handleChange('scrollTarget', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="section-id"
            />
            <p className="text-xs text-gray-400 mt-1">Enter the ID of the element to scroll to</p>
          </div>
        )}

        {action === 'modal' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Modal Content</label>
            <textarea
              value={modalContent}
              onChange={(e) => handleChange('modalContent', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              rows={3}
              placeholder="Content to display in the modal"
            />
          </div>
        )}

        {action === 'form' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Form ID</label>
            <input
              type="text"
              value={formAction}
              onChange={(e) => handleChange('formAction', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="form-id"
            />
            <p className="text-xs text-gray-400 mt-1">Enter the ID of the form to submit</p>
          </div>
        )}

        {action === 'download' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Download URL</label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => handleChange('downloadUrl', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Download Filename</label>
              <input
                type="text"
                value={downloadFilename}
                onChange={(e) => handleChange('downloadFilename', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="filename.pdf"
              />
              <p className="text-xs text-gray-400 mt-1">Optional: Specify a filename for the downloaded file</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Style</label>
          <select
            value={variant}
            onChange={(e) => handleChange('variant', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {variant === 'custom' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
              <ColorPickerPopup
                color={backgroundColor || 'rgba(31, 41, 55, 0.7)'}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Text Color</label>
              <ColorPickerPopup
                color={textColor || '#ffffff'}
                onChange={(color) => handleChange('textColor', color)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Border Color</label>
              <ColorPickerPopup
                color={borderColor || 'transparent'}
                onChange={(color) => handleChange('borderColor', color)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Border Radius</label>
              <input
                type="text"
                value={borderRadius}
                onChange={(e) => handleChange('borderRadius', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="0.375rem"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Size</label>
          <select
            value={size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Icon Position</label>
          <select
            value={iconPosition}
            onChange={(e) => handleChange('iconPosition', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="none">No Icon</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        {iconPosition !== 'none' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Icon Class</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="fa fa-arrow-right"
            />
            <p className="text-xs text-gray-400 mt-1">Enter a Font Awesome icon class</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Vertical Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'top')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'top' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'middle')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'middle' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Middle
            </button>
            <button
              type="button"
              onClick={() => handleChange('verticalAlign', 'bottom')}
              className={`px-3 py-1 rounded-md ${verticalAlign === 'bottom' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Bottom
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Horizontal Alignment</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'left')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'left' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'center')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'center' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => handleChange('horizontalAlign', 'right')}
              className={`px-3 py-1 rounded-md ${horizontalAlign === 'right' ? 'bg-theme-primary text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Right
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Margin</label>
            <input
              type="text"
              value={margin}
              onChange={(e) => handleChange('margin', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
            <input
              type="text"
              value={width}
              onChange={(e) => handleChange('width', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="auto"
            />
          </div>
        </div>

        {padding && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Padding</label>
            <input
              type="text"
              value={padding}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="0.5rem 1rem"
            />
          </div>
        )}
      </div>
    );
  };

  // Container component editor
  const renderContainerEditor = () => {
    const {
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
      gridRowSpan = 1
    } = selectedComponent.props;

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
          <ColorPickerPopup
            color={backgroundColor}
            onChange={(color) => handleChange('backgroundColor', color)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Layout</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Columns</label>
              <select
                value={columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Gap</label>
              <input
                type="text"
                value={gap}
                onChange={(e) => handleChange('gap', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="1rem"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Padding</label>
            <input
              type="text"
              value={padding}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="1rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Margin</label>
            <input
              type="text"
              value={margin}
              onChange={(e) => handleChange('margin', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="1rem 0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
            <input
              type="text"
              value={width}
              onChange={(e) => handleChange('width', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="100%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
            <input
              type="text"
              value={height}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Border Radius</label>
            <input
              type="text"
              value={borderRadius}
              onChange={(e) => handleChange('borderRadius', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              placeholder="0.5rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Box Shadow</label>
            <select
              value={boxShadow}
              onChange={(e) => handleChange('boxShadow', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
            >
              <option value="none">None</option>
              <option value="0 1px 3px rgba(0, 0, 0, 0.1)">Light</option>
              <option value="0 4px 6px rgba(0, 0, 0, 0.1)">Medium</option>
              <option value="0 10px 15px rgba(0, 0, 0, 0.1)">Heavy</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-theme-primary mb-2">Grid Sizing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Column Span (1-12)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={gridColumnSpan}
                onChange={(e) => handleChange('gridColumnSpan', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Row Span</label>
              <input
                type="number"
                min="1"
                max="6"
                value={gridRowSpan}
                onChange={(e) => handleChange('gridRowSpan', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Border</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Width</label>
              <input
                type="text"
                value={borderWidth}
                onChange={(e) => handleChange('borderWidth', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Style</label>
              <select
                value={borderStyle}
                onChange={(e) => handleChange('borderStyle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Color</label>
              <ColorPickerPopup
                color={borderColor}
                onChange={(color) => handleChange('borderColor', color)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Box Shadow</label>
          <select
            value={boxShadow === 'none' ? 'none' : (
              boxShadow === '0 1px 3px rgba(0, 0, 0, 0.1)' ? 'sm' : (
                boxShadow === '0 4px 6px rgba(0, 0, 0, 0.1)' ? 'md' : (
                  boxShadow === '0 10px 15px rgba(0, 0, 0, 0.1)' ? 'lg' : 'custom'
                )
              )
            )}
            onChange={(e) => {
              let shadowValue = 'none';
              if (e.target.value === 'sm') shadowValue = '0 1px 3px rgba(0, 0, 0, 0.1)';
              else if (e.target.value === 'md') shadowValue = '0 4px 6px rgba(0, 0, 0, 0.1)';
              else if (e.target.value === 'lg') shadowValue = '0 10px 15px rgba(0, 0, 0, 0.1)';
              else if (e.target.value === 'custom') shadowValue = boxShadow === 'none' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : boxShadow;

              handleChange('boxShadow', shadowValue);
            }}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="custom">Custom</option>
          </select>

          {boxShadow !== 'none' && boxShadow !== '0 1px 3px rgba(0, 0, 0, 0.1)' &&
           boxShadow !== '0 4px 6px rgba(0, 0, 0, 0.1)' && boxShadow !== '0 10px 15px rgba(0, 0, 0, 0.1)' && (
            <div className="mt-2">
              <input
                type="text"
                value={boxShadow}
                onChange={(e) => handleChange('boxShadow', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Navbar component editor
  const renderNavbarEditor = () => {
    const {
      title = 'My Website',
      links = [],
      fixed = true,
      backgroundColor = 'rgb(17, 24, 39)', // bg-gray-900
      textColor = 'rgb(229, 231, 235)', // text-gray-200
      accentColor = 'var(--theme-primary)' // theme-primary
    } = selectedComponent.props;

    // Function to add a new link
    const addLink = () => {
      const newLinks = [...links, { text: 'New Link', url: '#' }];
      handleChange('links', newLinks);
    };

    // Function to update a link
    const updateLink = (index: number, field: string, value: string) => {
      const newLinks = [...links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      handleChange('links', newLinks);
    };

    // Function to remove a link
    const removeLink = (index: number) => {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      handleChange('links', newLinks);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Website Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fixed Position</label>
          <ToggleSwitch
            checked={fixed}
            onChange={(checked) => handleChange('fixed', checked)}
            label="Stick navbar to top of page"
            id="navbar-fixed-position"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
          <ColorPickerPopup
            color={backgroundColor}
            onChange={(color) => handleChange('backgroundColor', color)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Text Color</label>
          <ColorPickerPopup
            color={textColor}
            onChange={(color) => handleChange('textColor', color)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Accent Color</label>
          <ColorPickerPopup
            color={accentColor}
            onChange={(color) => handleChange('accentColor', color)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">Navigation Links</label>
            <button
              type="button"
              onClick={addLink}
              className="text-xs bg-theme-primary hover:bg-theme-primary/80 text-white px-2 py-1 rounded"
            >
              Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <p className="text-gray-400 text-sm">No links added yet</p>
          ) : (
            <div className="space-y-3">
              {links.map((link: { text: string; url: string }, index: number) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">Link {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Text</label>
                      <input
                        type="text"
                        value={link.text}
                        onChange={(e) => updateLink(index, 'text', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Footer component editor
  const renderFooterEditor = () => {
    const {
      copyright = `© ${new Date().getFullYear()} My Website. All rights reserved.`,
      links = [],
      socialLinks = [],
      backgroundColor = 'rgb(17, 24, 39)', // bg-gray-900
      textColor = 'rgb(229, 231, 235)', // text-gray-200
      accentColor = 'var(--theme-primary)' // theme-primary
    } = selectedComponent.props;

    // Function to add a new link
    const addLink = () => {
      const newLinks = [...links, { text: 'New Link', url: '#' }];
      handleChange('links', newLinks);
    };

    // Function to update a link
    const updateLink = (index: number, field: string, value: string) => {
      const newLinks = [...links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      handleChange('links', newLinks);
    };

    // Function to remove a link
    const removeLink = (index: number) => {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      handleChange('links', newLinks);
    };

    // Function to add a new social link
    const addSocialLink = () => {
      const newSocialLinks = [...socialLinks, { platform: 'twitter', url: 'https://twitter.com' }];
      handleChange('socialLinks', newSocialLinks);
    };

    // Function to update a social link
    const updateSocialLink = (index: number, field: string, value: string) => {
      const newSocialLinks = [...socialLinks];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      handleChange('socialLinks', newSocialLinks);
    };

    // Function to remove a social link
    const removeSocialLink = (index: number) => {
      const newSocialLinks = [...socialLinks];
      newSocialLinks.splice(index, 1);
      handleChange('socialLinks', newSocialLinks);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Copyright Text</label>
          <input
            type="text"
            value={copyright}
            onChange={(e) => {
              // Ensure copyright symbol is always present
              let newValue = e.target.value;
              if (!newValue.includes('©')) {
                newValue = `© ${newValue}`;
              }
              handleChange('copyright', newValue);
            }}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
          <p className="text-xs text-gray-400 mt-1">The copyright symbol (©) will be automatically added if removed</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
          <ColorPickerPopup
            color={backgroundColor}
            onChange={(color) => handleChange('backgroundColor', color)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Text Color</label>
          <ColorPickerPopup
            color={textColor}
            onChange={(color) => handleChange('textColor', color)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Accent Color</label>
          <ColorPickerPopup
            color={accentColor}
            onChange={(color) => handleChange('accentColor', color)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">Quick Links</label>
            <button
              type="button"
              onClick={addLink}
              className="text-xs bg-theme-primary hover:bg-theme-primary/80 text-white px-2 py-1 rounded"
            >
              Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <p className="text-gray-400 text-sm">No links added yet</p>
          ) : (
            <div className="space-y-3">
              {links.map((link: { text: string; url: string }, index: number) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">Link {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Text</label>
                      <input
                        type="text"
                        value={link.text}
                        onChange={(e) => updateLink(index, 'text', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">Social Links</label>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-xs bg-theme-primary hover:bg-theme-primary/80 text-white px-2 py-1 rounded"
            >
              Add Social Link
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <p className="text-gray-400 text-sm">No social links added yet</p>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link: { platform: string; url: string }, index: number) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">Social Link {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Platform</label>
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      >
                        <option value="twitter">Twitter</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-theme-primary mb-4">
        {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Properties
      </h3>
      {renderPropertyEditor()}
    </div>
  );
};

export default PropertyEditor;
