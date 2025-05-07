import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandsDropdownOpen, setCommandsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCommandsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mainNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/tools', label: 'Tools' },
    { to: '/partnerships', label: 'Partnerships' },
    { to: '/about', label: 'About Us' },
  ];

  const commandLinks = [
    { to: '/utility', label: 'Utility' },
    { to: '/moderation', label: 'Moderation' },
    { to: '/roles', label: 'Roles' },
    { to: '/server', label: 'Server' },
    { to: '/channels', label: 'Channels' },
    { to: '/users', label: 'Users' },
  ];

  return (
    <nav className="bg-gray-900 dark:bg-black text-white py-4 shadow-md transition-colors duration-300 border-b border-theme-border/10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="https://cdn.wrappedbot.com/Wrapped%20Mascot%20Icon"
              alt="Wrapped mascot"
              className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-saira transition-colors duration-300 group-hover:text-theme-primary">Wrapped V2</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center ml-auto">
          {mainNavLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-theme-primary focus:text-theme-primary transition-colors duration-200 font-semibold relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-theme-primary after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
            >
              {link.label}
            </Link>
          ))}

          {/* Commands Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCommandsDropdownOpen(!commandsDropdownOpen)}
              className="flex items-center hover:text-theme-primary focus:text-theme-primary transition-colors duration-200 font-semibold"
            >
              Commands
              <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform duration-300 ${commandsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {commandsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-theme-border/20 animate-fadeIn">
                {commandLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-sm hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-theme-primary transition-colors duration-200"
                    onClick={() => setCommandsDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
              className="bg-theme-primary hover:bg-theme-primary/80 text-white px-3 py-1 rounded-md transition-colors duration-200 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Invite Bot
            </a>
            <a
              href="https://wrappedbot.com/support"
              className="hover:text-theme-primary focus:text-theme-primary transition-colors duration-200 relative font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Support
            </a>
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden ml-auto focus:outline-none transition-transform duration-200 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8 text-theme-primary transition-transform duration-200 rotate-90" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-theme-primary transition-transform duration-200" />
          )}
        </button>
      </div>
      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-lg transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div className={`flex flex-col justify-center items-center h-full w-full transition-transform duration-500 ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
          {/* Main Navigation Links */}
          {mainNavLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-2xl font-semibold mb-6 hover:text-theme-primary focus:text-theme-primary transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Commands Section */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold text-theme-primary mb-4">Commands</h3>
            <div className="grid grid-cols-2 gap-4">
              {commandLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xl font-semibold hover:text-theme-primary focus:text-theme-primary transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="flex flex-col items-center mb-6">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
              className="bg-theme-primary hover:bg-theme-primary/80 text-white px-4 py-2 rounded-md transition-colors duration-200 font-semibold mb-4"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Invite Bot
            </a>
            <a
              href="https://wrappedbot.com/support"
              className="text-xl font-semibold hover:text-theme-primary focus:text-theme-primary transition-colors duration-200 mb-4"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Support Server
            </a>
          </div>

          <div className="mb-6">
            <ThemeToggle onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
