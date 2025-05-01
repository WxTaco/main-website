import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://cdn.wrappedbot.com/Wrapped%20Mascot%20Icon"
              alt="Wrapped mascot"
              className="w-10 h-10"
            />
            <span className="text-xl font-saira">Wrapped V2</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/utility" className="hover:text-wrapped-pink transition-colors font-semibold">Utility</Link>
          <Link to="/moderation" className="hover:text-wrapped-pink transition-colors font-semibold">Moderation</Link>
          <Link to="/roles" className="hover:text-wrapped-pink transition-colors font-semibold">Roles</Link>
          <Link to="/server" className="hover:text-wrapped-pink transition-colors font-semibold">Server</Link>
          <Link to="/channels" className="hover:text-wrapped-pink transition-colors font-semibold">Channels</Link>
          <Link to="/users" className="hover:text-wrapped-pink transition-colors font-semibold">Users</Link>
          <Link to="/about" className="hover:text-wrapped-pink transition-colors">About Us</Link>
          <a
            href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
            className="hover:text-wrapped-pink transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Invite Wrapped
          </a>
          <a
            href="https://wrappedbot.com/support"
            className="hover:text-wrapped-pink transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Server
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 