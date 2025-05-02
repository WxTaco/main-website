import { Link } from 'react-router-dom';

const ChannelsOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Channel Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Manage and view channel information with these commands.</p>
        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/channels/commands" className="inline-block bg-wrapped-pink text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-600 transition-colors duration-200 mb-2">
              Channel Commands
            </Link>
            <p className="text-pink-200">View channel info, lock/unlock, slowmode, and purge messages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#channelinfo" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/channelinfo</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Get information about the current channel including ID, type, and creation date.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#lock" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/lock</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Lock a channel to prevent users from sending messages, with optional reason.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#unlock" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/unlock</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Unlock a channel to allow users to send messages again.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#slowmode" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/slowmode</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Set a rate limit cooldown between messages (0-21600 seconds).</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 md:col-span-2">
              <Link to="/channels/commands#purge" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/purge</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Delete messages from a channel with options to target specific users or bot messages.</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-2 px-4 rounded-md border border-wrapped-pink/50 transition-all duration-200">
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