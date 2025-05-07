import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  position?: "above" | "bottom";
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline, position = "bottom" }) => {
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
      className={`fixed ${position === "above" ? "bottom-20" : "bottom-4"} right-4 max-w-sm w-full bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden z-50 animate-slide-up`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <h3 className="text-sm font-medium text-white">Cookie Consent</h3>
            </div>
            <p className="text-xs text-gray-300 mb-2">
              We use cookies to enhance your experience and save your preferences.
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="ml-auto text-white hover:text-gray-200 focus:outline-none"
            aria-label="Decline cookies"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-end mt-2 space-x-2">
          <Link
            to="/cookie-policy"
            className="text-xs text-theme-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Cookie Policy
          </Link>
          <div className="flex-grow"></div>
          <button
            onClick={handleAccept}
            className="px-3 py-1 bg-theme-primary text-white text-xs rounded hover:bg-opacity-90 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
