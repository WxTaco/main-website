import { Link } from 'react-router-dom';

const ChannelsOverview = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Channel Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Manage and view channel information with these commands.</p>
        <div className="space-y-4 mb-6">
          <div className="themed-card">
            <Link to="/channels/commands" className="inline-block bg-theme-primary text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-theme-primary/80 transition-colors duration-200 mb-2">
              Channel Commands
            </Link>
            <p className="themed-text">View channel info, lock/unlock, slowmode, and purge messages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="themed-card">
              <Link to="/channels/commands#channelinfo" className="themed-button mb-2">
                <span className="mr-1">/channelinfo</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get information about the current channel including ID, type, and creation date.</p>
            </div>

            <div className="themed-card">
              <Link to="/channels/commands#lock" className="themed-button mb-2">
                <span className="mr-1">/lock</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Lock a channel to prevent users from sending messages, with optional reason.</p>
            </div>

            <div className="themed-card">
              <Link to="/channels/commands#unlock" className="themed-button mb-2">
                <span className="mr-1">/unlock</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Unlock a channel to allow users to send messages again.</p>
            </div>

            <div className="themed-card">
              <Link to="/channels/commands#slowmode" className="themed-button mb-2">
                <span className="mr-1">/slowmode</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Set a rate limit cooldown between messages (0-21600 seconds).</p>
            </div>

            <div className="themed-card md:col-span-2">
              <Link to="/channels/commands#purge" className="themed-button mb-2">
                <span className="mr-1">/purge</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Delete messages from a channel with options to target specific users or bot messages.</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="themed-button-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChannelsOverview;