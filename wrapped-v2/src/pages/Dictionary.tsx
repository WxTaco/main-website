import { Link } from 'react-router-dom';

const Dictionary = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Webster Dictionary Integration</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Instantly define any word using the trusted Webster dictionary! Just use a command to get clear, accurate definitions right in your server.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Features</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li>Get definitions for any English word.</li>
          <li>Easy-to-use command for quick lookups.</li>
          <li>Perfect for learning, moderation, and fun!</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Dictionary; 