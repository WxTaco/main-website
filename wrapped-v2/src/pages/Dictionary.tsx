import { Link } from 'react-router-dom';

const Dictionary = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Merriam-Webster Dictionary</h1>
        <p className="text-lg text-white mb-6 text-center">
          Instantly define any word using the trusted Merriam-Webster dictionary! Just use the <span className="font-mono bg-gray-700 px-1 rounded">/define</span> command to get clear, accurate definitions right in your server.
        </p>

        <h2 className="themed-subtitle mb-2">Command Usage</h2>
        <div className="themed-card mb-6">
          <p className="font-mono text-white mb-2">/define [word]</p>
          <p className="themed-text text-sm">Example: <span className="font-mono">/define serendipity</span></p>
        </div>

        <h2 className="themed-subtitle mb-2">Features</h2>
        <ul className="list-disc ml-6 mb-6 themed-text">
          <li>Get definitions for any English word from Merriam-Webster's Collegiate Dictionary.</li>
          <li>Displays up to 3 definitions in a clean, easy-to-read format.</li>
          <li>Shows part of speech (noun, verb, adjective, etc.).</li>
          <li>Suggests similar words if the exact word isn't found.</li>
          <li>Perfect for learning, education, and expanding vocabulary!</li>
        </ul>

        <div className="themed-card mb-6">
          <h3 className="text-xl font-bold text-theme-primary mb-2">Example Response</h3>
          <div className="border-l-4 border-theme-primary pl-3">
            <p className="font-bold text-white">📖 Definition of "serendipity"</p>
            <p className="themed-text mb-2">
              <span className="font-bold">1.</span> the faculty or phenomenon of finding valuable or agreeable things not sought for
            </p>
            <p className="text-sm text-gray-300">Part of Speech: noun</p>
            <p className="text-xs text-gray-400 mt-2">Source: Webster's Dictionary || Wrapped™️</p>
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

export default Dictionary;