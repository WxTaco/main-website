import { Link } from 'react-router-dom';

const Utility = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full themed-container">
        <h1 className="themed-title mb-6">Utility Commands</h1>
        <p className="text-lg text-white mb-8 text-center">All the tools you need to make your server more powerful and user-friendly.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="themed-card">
            <Link to="/utility/tickets" className="themed-button mb-2">
              <span className="mr-1">Tickets System</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Customizable support tickets with HTML transcripts.</p>
          </div>

          <div className="themed-card">
            <Link to="/utility/welcomer" className="themed-button mb-2">
              <span className="mr-1">Welcomer</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Welcome new members with custom messages.</p>
          </div>

          <div className="themed-card">
            <Link to="/utility/gemini" className="themed-button mb-2">
              <span className="mr-1">Google Gemini (AI)</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Generate images and text with AI.</p>
          </div>

          <div className="themed-card">
            <Link to="/utility/dictionary" className="themed-button mb-2">
              <span className="mr-1">Webster Dictionary</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Instantly define any word.</p>
          </div>

          <div className="themed-card">
            <Link to="/utility/image-gen" className="themed-button mb-2">
              <span className="mr-1">Image Generation</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Create solid color images with custom dimensions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utility;