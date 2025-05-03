import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/utility', label: 'Utility' },
    { to: '/moderation', label: 'Moderation' },
    { to: '/roles', label: 'Roles' },
    { to: '/server', label: 'Server' },
    { to: '/channels', label: 'Channels' },
    { to: '/users', label: 'Users' },
    { to: '/bot-builder', label: 'Bot Builder' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="https://cdn.wrappedbot.com/Wrapped%20Mascot%20Icon"
              alt="Wrapped mascot"
              className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-saira transition-colors duration-300 group-hover:text-wrapped-pink">Wrapped V2</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center ml-auto">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200 font-semibold relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-wrapped-pink after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
            className="hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200 relative font-semibold after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-wrapped-pink after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Invite Wrapped
          </a>
          <a
            href="https://wrappedbot.com/support"
            className="hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200 relative font-semibold after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-wrapped-pink after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Server
          </a>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden ml-auto focus:outline-none transition-transform duration-200 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8 text-wrapped-pink transition-transform duration-200 rotate-90" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-wrapped-pink transition-transform duration-200" />
          )}
        </button>
      </div>
      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-lg transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div className={`flex flex-col justify-center items-center h-full w-full transition-transform duration-500 ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-2xl font-semibold mb-6 hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
            className="text-2xl font-semibold mb-6 hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Invite Wrapped
          </a>
          <a
            href="https://wrappedbot.com/support"
            className="text-2xl font-semibold mb-6 hover:text-wrapped-pink focus:text-wrapped-pink transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Support Server
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;