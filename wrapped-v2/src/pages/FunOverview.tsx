import { Link } from 'react-router-dom';

const FunOverview = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Fun Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Lighten the mood in your server with these entertaining commands!</p>

        <div className="space-y-4 mb-6">
          <div className="themed-card">
            <Link to="/fun/commands" className="themed-button mb-2">
              <span className="mr-1">Fun Commands</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="themed-text">Jokes, memes, and magic 8-ball responses to entertain your server members.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="themed-card">
              <Link to="/fun/commands#fun-joke" className="themed-button mb-2">
                <span className="mr-1">/fun joke</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Get random jokes from various categories including programming, puns, and more.</p>
            </div>

            <div className="themed-card">
              <Link to="/fun/commands#fun-meme" className="themed-button mb-2">
                <span className="mr-1">/fun meme</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Fetch random memes from Reddit with customizable subreddit sources.</p>
            </div>

            <div className="themed-card">
              <Link to="/fun/commands#fun-8ball" className="themed-button mb-2">
                <span className="mr-1">/fun 8ball</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="themed-text">Ask the magic 8-ball a question and receive a mystical answer to your query.</p>
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

export default FunOverview;
