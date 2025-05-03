import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState } from 'react';

const Layout = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-wrapped-pink text-white py-3 px-4 relative">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <div className="flex items-center">
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md mr-2">EXPERIMENTAL</span>
              <p className="font-medium">
                Try our new Discord Bot Builder! <span className="hidden sm:inline">It's currently in development and may not function as intended.</span>
              </p>
            </div>
            <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center">
              <Link
                to="/bot-builder"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200 mx-2"
              >
                Try it out
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white hover:text-gray-200 ml-2 focus:outline-none"
                aria-label="Close banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;