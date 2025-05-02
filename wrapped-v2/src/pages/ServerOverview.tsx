import { Link } from 'react-router-dom';

const ServerOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Server Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Get all the info you need about your server with these commands.</p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/server/commands" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Server Commands</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">View server info, owner, boosters, invites, roles, and server images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-overview" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server overview</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">View general information about your server.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-owner" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server owner</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">View information about the server owner.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-roles" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server roles</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">View all roles in the server hierarchy.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-invites" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server invites</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">View all invites in the server.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-boosts" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server boosts</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">View server boost info and boosters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-avatar" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server avatar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Get the server avatar in full size.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-banner" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server banner</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Get the server banner in full size.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
              <Link to="/server/commands#server-splash" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                <span className="mr-1">/server splash</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-pink-200">Get the server splash image in full size.</p>
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

export default ServerOverview;