import { Link } from 'react-router-dom';

const Gemini = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Google Gemini Integration</h1>
        <p className="text-lg text-white mb-6 text-center">
          Use the power of Google Gemini directly in your server! Generate images and text with a simple command—perfect for creative projects, brainstorming, and fun.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">What Can You Do?</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li>Generate AI-powered images from text prompts.</li>
          <li>Ask Gemini to write stories, poems, or answer questions.</li>
          <li>Seamless integration—just use a command in your server!</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Gemini; 