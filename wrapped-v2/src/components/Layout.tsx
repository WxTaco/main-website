import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCookies } from '../contexts/CookieContext';
import CookieConsent from './CookieConsent';

const Layout = () => {
  const [showToast, setShowToast] = useState(false);
  const { theme } = useTheme();
  const { cookiesAccepted, acceptCookies, declineCookies } = useCookies();

  // Show toast after a short delay when component mounts
  useEffect(() => {
    const toastShown = localStorage.getItem('botBuilderToastShown');
    if (!toastShown) {
      const timer = setTimeout(() => {
        setShowToast(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseToast = () => {
    setShowToast(false);
    localStorage.setItem('botBuilderToastShown', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-background dark:bg-dark-primary transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />


      {/* Toast Notification */}
{/*
      {showToast && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-gradient-to-r from-indigo-600 to-wrapped-pink text-white rounded-lg shadow-lg overflow-hidden z-50 animate-slide-up">
          <div className="p-4">
            <div className="flex items-center mb-2">
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-md mr-2">EXPERIMENTAL</span>
              <h3 className="font-bold">Developer Tools</h3>
              <button
                onClick={handleCloseToast}
                className="ml-auto text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close toast"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-3">We're now focusing on experimental developer tools! Try our suite of utilities designed to make your development workflow easier.</p>
            <div className="flex justify-end">
              <Link
                to="/bot-builder"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200 mr-2"
                onClick={handleCloseToast}
              >
                Bot Builder
              </Link>
              <Link
                to="/css-generator"
                className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200"
                onClick={handleCloseToast}
              >
                CSS Generator
              </Link>
            </div>
          </div>
        </div>
      )}
*/}

      {/* Cookie Consent Toast - only show if user hasn't made a decision yet */}
      {cookiesAccepted === null && (
        <CookieConsent
          onAccept={acceptCookies}
          onDecline={declineCookies}
          position={showToast ? "above" : "bottom"}
        />
      )}
    </div>
  );
};

export default Layout;
