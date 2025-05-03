import { Link } from 'react-router-dom';

const UsersOverview = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">User Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">View detailed information about any user in your server with these commands.</p>

        <div className="space-y-4 mb-6">
          <div className="themed-card">
            <Link to="/users/commands" className="themed-button mb-2">
              <span className="mr-1">User Commands</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">View user info, avatar, banner, and more with the /user command.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="themed-card">
              <Link to="/users/commands#user-info" className="themed-button mb-2">
                <span className="mr-1">/user info</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get detailed user information including join date, roles, and status.</p>
            </div>

            <div className="themed-card">
              <Link to="/users/commands#user-avatar" className="themed-button mb-2">
                <span className="mr-1">/user avatar</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View a user's avatar in full size (public or server-specific).</p>
            </div>

            <div className="themed-card">
              <Link to="/users/commands#user-banner" className="themed-button mb-2">
                <span className="mr-1">/user banner</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">View a user's banner in full size (public or server-specific).</p>
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

export default UsersOverview;