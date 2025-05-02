import { Link } from 'react-router-dom';

const ModerationOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Moderation Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Keep your server safe and friendly with these moderation tools.</p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/moderation/tools" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Moderation Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Ban, kick, timeout, nickname, mute, warn, clear, and more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/moderation/tools#timeout" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/timeout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Timeout a user for a specified duration with customizable time options.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/moderation/tools#nickname" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/nickname</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Change a user's nickname in your server.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#lock" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">Channel Controls</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Lock/unlock channels and set slowmode to control message flow.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/channels/commands#purge" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/purge</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Bulk delete user or bot messages to keep channels clean.</p>
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

export default ModerationOverview;