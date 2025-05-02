import { Link } from 'react-router-dom';

const Dictionary = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Merriam-Webster Dictionary</h1>
        <p className="text-lg text-white mb-6 text-center">
          Instantly define any word using the trusted Merriam-Webster dictionary! Just use the <span className="font-mono bg-gray-700 px-1 rounded">/define</span> command to get clear, accurate definitions right in your server.
        </p>

        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Command Usage</h2>
        <div className="bg-gray-900/70 p-4 rounded-lg border border-wrapped-pink/30 mb-6">
          <p className="font-mono text-white mb-2">/define [word]</p>
          <p className="text-pink-200 text-sm">Example: <span className="font-mono">/define serendipity</span></p>
        </div>

        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Features</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li>Get definitions for any English word from Merriam-Webster's Collegiate Dictionary.</li>
          <li>Displays up to 3 definitions in a clean, easy-to-read format.</li>
          <li>Shows part of speech (noun, verb, adjective, etc.).</li>
          <li>Suggests similar words if the exact word isn't found.</li>
          <li>Perfect for learning, education, and expanding vocabulary!</li>
        </ul>

        <div className="bg-gray-900/70 p-4 rounded-lg border border-wrapped-pink/30 mb-6">
          <h3 className="text-xl font-bold text-wrapped-pink mb-2">Example Response</h3>
          <div className="border-l-4 border-wrapped-pink pl-3">
            <p className="font-bold text-white">📖 Definition of "serendipity"</p>
            <p className="text-pink-200 mb-2">
              <span className="font-bold">1.</span> the faculty or phenomenon of finding valuable or agreeable things not sought for
            </p>
            <p className="text-sm text-gray-300">Part of Speech: noun</p>
            <p className="text-xs text-gray-400 mt-2">Source: Webster's Dictionary || Wrapped™️</p>
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

export default Dictionary;