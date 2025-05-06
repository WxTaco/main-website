import React from 'react';
import WebsiteComponent from './WebsiteComponent';
import type { NavbarComponentProps } from './componentTypes';

// @ts-ignore
/** @typedef {Object} NavbarComponentProps
 * @property {string} id
 * @property {string} type
 * @property {string} [content]
 * @property {React.ReactNode} [children]
 * @property {React.CSSProperties} [style]
 * @property {string} [className]
 * @property {(id: string) => void} [onEdit]
 * @property {(id: string) => void} [onDelete]
 * @property {boolean} [isSelected]
 * @property {string} [title]
 * @property {string} [logo]
 * @property {Array<{text: string, url: string}>} [links]
 * @property {boolean} [fixed]
 * @property {string} [backgroundColor]
 * @property {string} [textColor]
 * @property {string} [accentColor]
 */

const NavbarComponent: React.FC<NavbarComponentProps> = ({
  id,
  title = 'My Website',
  logo,
  links = [
    { text: 'Home', url: '#' },
    { text: 'About', url: '#about' },
    { text: 'Services', url: '#services' },
    { text: 'Contact', url: '#contact' },
  ],
  fixed = true,
  backgroundColor = 'rgb(17, 24, 39)', // bg-gray-900
  textColor = 'rgb(229, 231, 235)', // text-gray-200
  accentColor = 'var(--theme-primary)', // theme-primary
  onEdit,
  onDelete,
  isSelected,
}) => {

  return (
    <WebsiteComponent
      id={id}
      type="navbar"
      className={`w-full py-4 shadow-md border-b border-theme-border/10 ${fixed ? 'sticky top-0 z-50' : ''} relative group`}
      style={{ backgroundColor }}
      onEdit={onEdit}
      onDelete={onDelete}
      isSelected={isSelected}
    >
      {/* Edit indicator */}
      <div className="absolute top-0 right-0 bg-theme-primary text-white text-xs px-2 py-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
           onClick={() => onEdit && onEdit(id)}>
        Click to Edit Navbar
      </div>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
          )}
          <span className="text-xl font-saira" style={{ color: accentColor }}>{title}</span>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="transition-colors duration-200"
              style={{ color: textColor }}
            >
              {link.text}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button style={{ color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </WebsiteComponent>
  );
};

export default NavbarComponent;
