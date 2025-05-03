import { Link } from 'react-router-dom';

const BotBuilder = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-4xl w-full themed-container">
        <h1 className="themed-title">Discord Bot Builder</h1>
        <p className="text-lg text-white mb-6 text-center">
          Create your own Discord bot with our visual block-based builder! No coding experience required - just drag, drop, and connect blocks to build your perfect bot.
        </p>

        <div className="themed-card p-6 mb-8">
          <h2 className="themed-subtitle mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/80 p-4 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-theme-primary mb-2">1. Add Blocks</h3>
              <p className="themed-text text-center">Drag and drop blocks for commands, events, and features.</p>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-theme-primary mb-2">2. Connect Blocks</h3>
              <p className="themed-text text-center">Link blocks together to create your bot's logic flow.</p>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-theme-primary mb-2">3. Export Code</h3>
              <p className="themed-text text-center">Download ready-to-use Discord.js bot files.</p>
            </div>
          </div>
        </div>

        <div className="themed-card p-6 mb-8">
          <h2 className="themed-subtitle mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Visual Builder</h3>
                <p className="themed-text">Intuitive drag-and-drop interface for building your bot.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Pre-built Blocks</h3>
                <p className="themed-text">Command, event, and utility blocks ready to use.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Real-time Preview</h3>
                <p className="themed-text">See your bot's code as you build it.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">One-Click Export</h3>
                <p className="themed-text">Download all necessary files with a single click.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Discord.js Compatible</h3>
                <p className="themed-text">Works with the latest Discord.js version.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-theme-primary rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-theme-primary">Customizable</h3>
                <p className="themed-text">Adjust parameters and settings for each block.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/bot-builder/editor"
            className="inline-flex items-center bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">Start Building</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-4 text-gray-300">
            Already have a bot? <Link to="/bot-builder/import" className="text-theme-primary hover:underline">Import your existing code</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotBuilder;
