import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useCookies } from '../contexts/CookieContext';

const CookiePolicy: React.FC = () => {
  const { cookiesAccepted, acceptCookies, declineCookies, resetCookieConsent } = useCookies();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Wrapper functions to show notifications when cookie preferences change
  const handleAcceptCookies = () => {
    acceptCookies();
    setNotification({
      message: 'Cookies accepted. Your preferences and settings will now be saved.',
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeclineCookies = () => {
    declineCookies();
    setNotification({
      message: 'Cookies declined. Your preferences and settings will not be saved.',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleResetCookieConsent = () => {
    resetCookieConsent();
    setNotification({
      message: 'Cookie preferences reset. Please make a selection.',
      type: 'warning'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Cookie Policy | Wrapped Bot</title>
      </Helmet>

      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-fade-in ${
            notification.type === 'success' ? 'bg-green-800 text-white' :
            notification.type === 'warning' ? 'bg-yellow-700 text-white' :
            'bg-blue-800 text-white'
          }`}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {notification.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button
              className="ml-auto -mr-1 text-white opacity-70 hover:opacity-100"
              onClick={() => setNotification(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-theme-primary">Cookie Policy</h1>
          <div className="flex space-x-3">
            {cookiesAccepted !== null && (
              <div className="flex items-center bg-gray-700 px-3 py-1.5 rounded-md">
                <span className="text-sm text-gray-300 mr-2">
                  Cookies are currently {cookiesAccepted ? 'accepted' : 'declined'}
                </span>
                <button
                  onClick={handleResetCookieConsent}
                  className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
                  title="Reset your cookie preference"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Introduction</h2>
          <p className="text-gray-300 mb-4">
            This Cookie Policy explains how Wrapped Bot ("we", "us", or "our") uses cookies and similar technologies
            to recognize you when you visit our website at wrappedbot.com ("Website"). It explains what these technologies are
            and why we use them, as well as your rights to control our use of them.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">What are cookies?</h2>
          <p className="text-gray-300 mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
            as well as to provide reporting information.
          </p>
          <p className="text-gray-300 mb-4">
            Cookies set by the website owner (in this case, Wrapped Bot) are called "first-party cookies".
            Cookies set by parties other than the website owner are called "third-party cookies".
            Third-party cookies enable third-party features or functionality to be provided on or through the website
            (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies
            can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Why do we use cookies?</h2>
          <p className="text-gray-300 mb-4">
            We use first-party cookies for several reasons. Some cookies are required for technical reasons in order for our
            Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable
            us to track and target the interests of our users to enhance the experience on our Website. This includes:
          </p>

          <ul className="list-disc pl-6 text-gray-300 mb-4">
            <li className="mb-2">
              <strong className="text-white">Preferences:</strong> We use cookies to store your preferences, such as your selected theme and accessibility settings.
            </li>
            <li className="mb-2">
              <strong className="text-white">Authentication:</strong> We use cookies to recognize you when you return to our Website.
            </li>
            <li className="mb-2">
              <strong className="text-white">Analytics:</strong> We use cookies to understand how our Website is being used, how effective our marketing campaigns are, and to help us customize and improve our services for you.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">What types of cookies do we use?</h2>

          <h3 className="text-lg font-medium text-white mt-4 mb-2">Essential Cookies</h3>
          <p className="text-gray-300 mb-4">
            These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website, you cannot refuse them without impacting how our Website functions.
          </p>

          <h3 className="text-lg font-medium text-white mt-4 mb-2">Preference Cookies</h3>
          <p className="text-gray-300 mb-4">
            These cookies allow us to remember choices you make when you use our Website, such as your preferred theme, language, or other display preferences. The purpose of these cookies is to provide you with a more personal experience and to avoid you having to re-select your preferences every time you visit our Website.
          </p>

          <h3 className="text-lg font-medium text-white mt-4 mb-2">Analytics Cookies</h3>
          <p className="text-gray-300 mb-4">
            These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you. We may use third-party analytics providers, such as Google Analytics, to help us analyze how users use the Website.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">How can you control cookies?</h2>
          <p className="text-gray-300 mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences when you first visit our Website through our cookie consent banner.
          </p>
          <p className="text-gray-300 mb-4">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">How often will we update this Cookie Policy?</h2>
          <p className="text-gray-300 mb-4">
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
          <p className="text-gray-300 mb-4">
            The date at the top of this Cookie Policy indicates when it was last updated.
          </p>

          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Contact Us</h2>
          <p className="text-gray-300 mb-4">
            If you have any questions about our use of cookies or other technologies, please contact us at:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mb-4">
            <li>Discord: <a href="https://wrappedbot.com/support" className="text-theme-primary hover:underline">Join our support server</a></li>
          </ul>
        </div>

        {/* Cookie consent management section */}
        <div className="mt-10 pt-6 border-t border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Manage Cookie Preferences</h2>
          <p className="text-gray-300 mb-6">
            You can change your cookie preferences at any time. Accepting cookies allows us to provide you with a better experience by remembering your preferences and settings.
          </p>

          {cookiesAccepted === null ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDeclineCookies}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Decline Cookies
              </button>
              <button
                onClick={handleAcceptCookies}
                className="px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-md transition-colors"
              >
                Accept Cookies
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              {cookiesAccepted ? (
                <button
                  onClick={handleDeclineCookies}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Switch to Declining Cookies
                </button>
              ) : (
                <button
                  onClick={handleAcceptCookies}
                  className="px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-md transition-colors"
                >
                  Switch to Accepting Cookies
                </button>
              )}
              <button
                onClick={handleResetCookieConsent}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Reset Cookie Preference
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700/50 rounded-md">
            <p className="text-sm text-gray-300">
              <strong className="text-white">Note:</strong> If you decline cookies, some features of the website may not function properly. Essential cookies will still be used as they are necessary for the website to function.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
