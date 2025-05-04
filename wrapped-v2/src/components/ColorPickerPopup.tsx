import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerPopupProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPickerPopup: React.FC<ColorPickerPopupProps> = ({ color, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (newColor: any) => {
    onChange(newColor.hex);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="color-picker-container">
      {label && <p className="color-picker-label">{label}</p>}
      <div className="color-preview-wrapper">
        <button
          className="color-preview-button"
          style={{ backgroundColor: color }}
          onClick={togglePicker}
          aria-label={`Select ${label || 'color'}`}
        />
        <span className="color-value">{color}</span>
      </div>

      {showPicker && (
        <div className="color-picker-popup">
          <div className="color-picker-popup-overlay" onClick={togglePicker}></div>
          <div className="color-picker-popup-content" ref={pickerRef}>
            <ChromePicker
              color={color}
              onChange={handleColorChange}
              disableAlpha={false}
            />
            <div className="color-picker-popup-actions">
              <button
                className="color-picker-popup-close"
                onClick={togglePicker}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerPopup;
