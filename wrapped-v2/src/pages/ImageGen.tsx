import { Link } from 'react-router-dom';

const ImageGen = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Image Generation</h1>
        <p className="text-lg text-white mb-6 text-center">
          Generate solid color images with customizable dimensions! Perfect for design work, placeholders, or creating visual elements for your server.
        </p>

        <div className="themed-card mb-6">
          <h2 className="themed-subtitle mb-3">Single Color Image Command</h2>

          <div className="bg-gray-800/70 p-3 rounded border border-theme-primary/30 mb-4">
            <code className="text-theme-primary font-mono">/single-color-image hex:#ff85a9 width:500 height:300</code>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">Required Parameters:</h3>
          <ul className="list-disc ml-6 mb-4 themed-text">
            <li><span className="font-bold">hex</span> — Hex color code in the format #rrggbb (e.g., #ff85a9)</li>
            <li><span className="font-bold">width</span> — Width of the image (1-5000 pixels)</li>
            <li><span className="font-bold">height</span> — Height of the image (1-5000 pixels)</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-2">Features:</h3>
          <ul className="list-disc ml-6 mb-4 themed-text">
            <li>Creates a PNG image of your specified color and dimensions</li>
            <li>Displays the image in an embed that matches the color</li>
            <li>Shows the hex code and dimensions in the embed description</li>
            <li>Perfect for design mockups, color samples, or server decorations</li>
          </ul>

          <div className="bg-black/30 p-3 rounded mt-4 border border-theme-border/20">
            <p className="text-white text-sm italic">
              <span className="text-wrapped-yellow font-bold">Note:</span> The image is generated using the singlecolorimage.com service.
              Maximum dimensions are 5000×5000 pixels.
            </p>
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

export default ImageGen;