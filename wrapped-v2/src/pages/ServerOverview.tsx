import { Link } from 'react-router-dom';

const ServerOverview = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Server Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Get all the info you need about your server with these commands.</p>

        <div className="space-y-4 mb-6">
          <div className="themed-card">
            <Link to="/server/commands" className="themed-button mb-2">
              <span className="mr-1">Server Commands</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">View server info, owner, boosters, invites, roles, and server images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="themed-card">
              <Link to="/server/commands#server-overview" className="themed-button mb-2">
                <span className="mr-1">/server overview</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View general information about your server.</p>
            </div>

            <div className="themed-card">
              <Link to="/server/commands#server-owner" className="themed-button mb-2">
                <span className="mr-1">/server owner</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View information about the server owner.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="themed-card">
              <Link to="/server/commands#server-roles" className="themed-button mb-2">
                <span className="mr-1">/server roles</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View all roles in the server hierarchy.</p>
            </div>

            <div className="themed-card">
              <Link to="/server/commands#server-invites" className="themed-button mb-2">
                <span className="mr-1">/server invites</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View all invites in the server.</p>
            </div>

            <div className="themed-card">
              <Link to="/server/commands#server-boosts" className="themed-button mb-2">
                <span className="mr-1">/server boosts</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View server boost info and boosters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="themed-card">
              <Link to="/server/commands#server-avatar" className="themed-button mb-2">
                <span className="mr-1">/server avatar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get the server avatar in full size.</p>
            </div>

            <div className="themed-card">
              <Link to="/server/commands#server-banner" className="themed-button mb-2">
                <span className="mr-1">/server banner</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get the server banner in full size.</p>
            </div>

            <div className="themed-card">
              <Link to="/server/commands#server-splash" className="themed-button mb-2">
                <span className="mr-1">/server splash</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get the server splash image in full size.</p>
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

export default ServerOverview;