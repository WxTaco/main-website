import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Convert RGB to HEX for the color input
  const rgbToHex = (rgb: string) => {
    // Check if the rgb value is in the format "rgb(r, g, b)"
    const match = rgb.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (!match) return rgb;
    
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  // Get hex color for the color input
  const getHexColor = () => {
    if (color.startsWith('rgb')) {
      return rgbToHex(color);
    } else if (color.startsWith('var')) {
      return '#6d28d9'; // Default purple for CSS variables
    }
    return color;
  };
  
  // Handle clicking outside to close the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update input value when color prop changes
  useEffect(() => {
    setInputValue(color);
  }, [color]);
  
  // Handle color input change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };
  
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };
  
  // Apply the color when text input loses focus
  const handleBlur = () => {
    onChange(inputValue);
  };
  
  // Predefined color options
  const colorOptions = [
    { name: 'Gray 900', value: 'rgb(17, 24, 39)' },
    { name: 'Gray 800', value: 'rgb(31, 41, 55)' },
    { name: 'Gray 700', value: 'rgb(55, 65, 81)' },
    { name: 'Purple', value: 'rgb(109, 40, 217)' },
    { name: 'Indigo', value: 'rgb(79, 70, 229)' },
    { name: 'Blue', value: 'rgb(37, 99, 235)' },
    { name: 'Green', value: 'rgb(16, 185, 129)' },
    { name: 'Red', value: 'rgb(239, 68, 68)' },
    { name: 'Orange', value: 'rgb(249, 115, 22)' },
    { name: 'Yellow', value: 'rgb(245, 158, 11)' },
    { name: 'Theme Primary', value: 'var(--theme-primary)' },
  ];
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="w-10 h-10 rounded border border-gray-700 flex items-center justify-center overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: color.startsWith('var') ? 'rgb(109, 40, 217)' : color }}
        >
          <span className="sr-only">Select color</span>
        </button>
        
        <input
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-theme-primary"
          placeholder="rgb(17, 24, 39) or #111827"
        />
      </div>
      
      {isOpen && (
        <div 
          ref={popoverRef}
          className="absolute z-10 mt-2 p-4 bg-gray-800 rounded-md shadow-lg border border-gray-700 w-64"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Color Picker</label>
            <input
              type="color"
              value={getHexColor()}
              onChange={handleColorChange}
              className="w-full h-10 rounded border border-gray-700 bg-transparent cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Preset Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-8 h-8 rounded border border-gray-700 hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: option.value.startsWith('var') ? 'rgb(109, 40, 217)' : option.value,
                    outline: inputValue === option.value ? '2px solid white' : 'none',
                    outlineOffset: '2px'
                  }}
                  onClick={() => {
                    setInputValue(option.value);
                    onChange(option.value);
                  }}
                  title={option.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
