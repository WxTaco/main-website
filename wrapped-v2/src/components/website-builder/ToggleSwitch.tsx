import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  id = 'toggle-switch' 
}) => {
  return (
    <div className="flex items-center">
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-theme-primary"
          style={{
            top: '0',
            left: checked ? '16px' : '0',
            transition: 'left 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
            backgroundColor: checked ? 'var(--theme-primary)' : 'white',
            borderColor: checked ? 'var(--theme-primary)' : 'rgb(55, 65, 81)',
          }}
        />
        <label
          htmlFor={id}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${
            checked ? 'bg-theme-primary/30' : 'bg-gray-700'
          }`}
        ></label>
      </div>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;
