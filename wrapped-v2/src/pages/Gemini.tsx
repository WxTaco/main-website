import { Link } from 'react-router-dom';

const Gemini = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Google Gemini Integration</h1>
        <p className="text-lg text-white mb-6 text-center">
          Use the power of Google Gemini directly in your server! Generate images and text with a simple command—perfect for creative projects, brainstorming, and fun.
        </p>

        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">/gemini</h2>
          <p className="text-pink-200 mb-4">Use Gemini AI for text or image generation.</p>

          <h3 className="text-xl font-semibold text-white mb-3">Subcommands</h3>
          <div className="space-y-6">
            {/* Text Generation */}
            <div className="border-l-2 border-wrapped-pink pl-4">
              <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/gemini text</h4>
              <p className="text-pink-200 mb-3">Generate text using Gemini</p>

              <h5 className="text-white font-medium mb-2">Options:</h5>
              <ul className="list-disc ml-6 mb-3 text-pink-200">
                <li>
                  <span className="font-semibold">prompt</span> — Text prompt
                  <span className="text-wrapped-yellow"> (Required)</span>
                </li>
                <li>
                  <span className="font-semibold">tokens</span> — Max tokens (default 500)
                  <span className="text-wrapped-blue"> (Min: 1, Max: 2048)</span>
                </li>
              </ul>

              <div className="bg-black/20 p-3 rounded mt-2">
                <p className="text-pink-200 text-sm">
                  Generates text responses using Gemini 2.0 Flash model. For longer responses (over 4096 characters),
                  the bot will automatically send the response as a text file attachment.
                </p>
              </div>
            </div>

            {/* Image Generation */}
            <div className="border-l-2 border-wrapped-pink pl-4">
              <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/gemini image</h4>
              <p className="text-pink-200 mb-3">Generate an image using Gemini</p>

              <h5 className="text-white font-medium mb-2">Options:</h5>
              <ul className="list-disc ml-6 mb-3 text-pink-200">
                <li>
                  <span className="font-semibold">prompt</span> — Image prompt
                  <span className="text-wrapped-yellow"> (Required)</span>
                </li>
              </ul>

              <div className="bg-black/20 p-3 rounded mt-2">
                <p className="text-pink-200 text-sm">
                  Creates AI-generated images based on your text prompt using Gemini 2.0 Flash experimental image generation model.
                  The generated image will be embedded directly in the response.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-wrapped-pink mb-2">Example Usage</h3>
          <div className="space-y-2 text-pink-200">
            <p><code className="bg-black/30 px-2 py-1 rounded">/gemini text prompt:Write a short story about a robot learning to paint</code></p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/gemini text prompt:Explain quantum computing tokens:1000</code></p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/gemini image prompt:A futuristic city with flying cars and neon lights</code></p>
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-wrapped-pink mb-2">Features</h3>
          <ul className="list-disc ml-6 text-pink-200">
            <li>Uses the latest Gemini 2.0 Flash model for text generation</li>
            <li>Experimental image generation capabilities</li>
            <li>Adjustable token limit for controlling response length</li>
            <li>Automatic file attachment for very long responses</li>
            <li>Embedded responses with clear formatting</li>
          </ul>
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

export default Gemini;