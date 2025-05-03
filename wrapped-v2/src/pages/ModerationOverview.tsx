import { Link } from 'react-router-dom';

const ModerationOverview = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Moderation Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Keep your server safe and friendly with these moderation tools.</p>

        <div className="space-y-4 mb-6">
          <div className="themed-card">
            <Link to="/moderation/tools" className="themed-button mb-2">
              <span className="mr-1">Moderation Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Ban, kick, timeout, nickname, mute, warn, clear, and more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="themed-card">
              <Link to="/moderation/tools#timeout" className="themed-button mb-2">
                <span className="mr-1">/timeout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Timeout a user for a specified duration with customizable time options.</p>
            </div>

            <div className="themed-card">
              <Link to="/moderation/tools#nickname" className="themed-button mb-2">
                <span className="mr-1">/nickname</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Change a user's nickname in your server.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="themed-card">
              <Link to="/channels/commands#lock" className="themed-button mb-2">
                <span className="mr-1">Channel Controls</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Lock/unlock channels and set slowmode to control message flow.</p>
            </div>

            <div className="themed-card">
              <Link to="/channels/commands#purge" className="themed-button mb-2">
                <span className="mr-1">/purge</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Bulk delete user or bot messages to keep channels clean.</p>
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

export default ModerationOverview;