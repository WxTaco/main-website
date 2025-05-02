import { Link } from 'react-router-dom';

const Utility = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">Utility Commands</h1>
        <p className="text-lg text-white mb-8 text-center">All the tools you need to make your server more powerful and user-friendly.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/tickets" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Tickets System</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Customizable support tickets with HTML transcripts.</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/reaction-roles" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Reaction Roles</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Let users assign themselves roles with emoji reactions.</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/welcomer" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Welcomer</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Welcome new members with custom messages.</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/gemini" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Google Gemini (AI)</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Generate images and text with AI.</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/dictionary" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Webster Dictionary</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Instantly define any word.</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/image-gen" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Image Generation</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Create solid color images with custom dimensions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utility;