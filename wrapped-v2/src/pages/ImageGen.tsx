import { Link } from 'react-router-dom';

const ImageGen = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Image Generation</h1>
        <p className="text-lg text-white mb-6 text-center">
          Generate solid color images with customizable dimensions! Perfect for design work, placeholders, or creating visual elements for your server.
        </p>

        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">Single Color Image Command</h2>

          <div className="bg-gray-800/70 p-3 rounded border border-wrapped-pink/30 mb-4">
            <code className="text-wrapped-pink font-mono">/single-color-image hex:#ff85a9 width:500 height:300</code>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">Required Parameters:</h3>
          <ul className="list-disc ml-6 mb-4 text-pink-200">
            <li><span className="font-bold">hex</span> — Hex color code in the format #rrggbb (e.g., #ff85a9)</li>
            <li><span className="font-bold">width</span> — Width of the image (1-5000 pixels)</li>
            <li><span className="font-bold">height</span> — Height of the image (1-5000 pixels)</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-2">Features:</h3>
          <ul className="list-disc ml-6 mb-4 text-pink-200">
            <li>Creates a PNG image of your specified color and dimensions</li>
            <li>Displays the image in an embed that matches the color</li>
            <li>Shows the hex code and dimensions in the embed description</li>
            <li>Perfect for design mockups, color samples, or server decorations</li>
          </ul>

          <div className="bg-black/30 p-3 rounded mt-4">
            <p className="text-white text-sm italic">
              <span className="text-wrapped-yellow font-bold">Note:</span> The image is generated using the singlecolorimage.com service.
              Maximum dimensions are 5000×5000 pixels.
            </p>
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

export default ImageGen;