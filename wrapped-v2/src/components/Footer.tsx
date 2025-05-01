import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-saira mb-4">Wrapped V2</h3>
            <p className="text-gray-400">
              A multi-purpose Discord bot designed with you in mind.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-saira mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/utility" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  Utility
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-saira mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-wrapped-pink transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wrapped V2. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 