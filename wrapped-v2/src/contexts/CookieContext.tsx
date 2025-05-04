import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface CookieContextType {
  cookiesAccepted: boolean | null;
  acceptCookies: () => void;
  declineCookies: () => void;
  resetCookieConsent: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

interface CookieProviderProps {
  children: ReactNode;
}

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  // null means not decided yet, true means accepted, false means declined
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem('cookieConsent');
    if (consentStatus === 'accepted') {
      setCookiesAccepted(true);
    } else if (consentStatus === 'declined') {
      setCookiesAccepted(false);
    }
  }, []);

  const acceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const declineCookies = () => {
    setCookiesAccepted(false);
    localStorage.setItem('cookieConsent', 'declined');
    
    // Clear any existing cookies except essential ones
    // This is a simplified approach - in a real app you might want to be more selective
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (name.trim() !== 'cookieConsent') {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
    });
  };

  const resetCookieConsent = () => {
    setCookiesAccepted(null);
    localStorage.removeItem('cookieConsent');
  };

  return (
    <CookieContext.Provider value={{ cookiesAccepted, acceptCookies, declineCookies, resetCookieConsent }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

export default CookieContext;
