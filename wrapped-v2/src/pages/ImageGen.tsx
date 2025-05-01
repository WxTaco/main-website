import { Link } from 'react-router-dom';

const ImageGen = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Image Generation</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Instantly generate an image of any single color! Just use the command and specify your color to get a crisp, solid color image for your needs.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">How It Works</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li>Use the <span className="font-bold">/color</span> command and specify a color (name or hex code).</li>
          <li>The bot generates and sends an image of that color.</li>
          <li>Great for design, moderation, or fun!</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ImageGen; 