import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay before showing the toast to prevent it from appearing during page transitions
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => {
      onAccept();
    }, 300); // Wait for animation to complete
  };

  const handleDecline = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDecline();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
      style={{
        animation: 'slideUp 0.3s ease-out forwards',
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 mx-4">
        <div className="flex items-start mb-3">
          <div className="flex-shrink-0 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Cookie Consent</h3>
            <p className="text-xs text-gray-300">
              We use cookies to enhance your experience and save your preferences.
              By clicking "Accept", you consent to the use of all cookies.
              You can manage your preferences by clicking "Decline".
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <div className="flex space-x-2">
            <Link
              to="/cookie-policy"
              className="text-xs text-theme-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Cookie Policy
            </Link>
          </div>
          <div className="flex-grow"></div>
          <div className="flex space-x-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-theme-primary text-white text-xs rounded hover:bg-opacity-90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
