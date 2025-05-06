import { Link } from 'react-router-dom';

const WebsiteBuilder = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-4xl w-full themed-container">
        <h1 className="themed-title">Website Builder</h1>
        <p className="text-lg text-white mb-6 text-center">
          Create your own website with our visual block-based builder! No coding experience required - just drag, drop, and customize blocks to build your perfect website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/70 rounded-lg p-6 border border-theme-border/30">
            <h2 className="text-xl font-saira text-theme-primary mb-3">Easy to Use</h2>
            <p className="text-gray-300">
              Our intuitive drag-and-drop interface makes it simple to create professional-looking websites in minutes. No technical skills required!
            </p>
          </div>

          <div className="bg-gray-900/70 rounded-lg p-6 border border-theme-border/30">
            <h2 className="text-xl font-saira text-theme-primary mb-3">Fully Customizable</h2>
            <p className="text-gray-300">
              Choose from a variety of components and customize colors, fonts, and layouts to match your brand and style.
            </p>
          </div>

          <div className="bg-gray-900/70 rounded-lg p-6 border border-theme-border/30">
            <h2 className="text-xl font-saira text-theme-primary mb-3">Real-time Preview</h2>
            <p className="text-gray-300">
              See exactly how your website will look as you build it with our real-time preview feature.
            </p>
          </div>

          <div className="bg-gray-900/70 rounded-lg p-6 border border-theme-border/30">
            <h2 className="text-xl font-saira text-theme-primary mb-3">Responsive Design</h2>
            <p className="text-gray-300">
              All websites created with our builder are automatically responsive and look great on any device.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/website-builder/editor"
            className="inline-flex items-center bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">Start Building</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-4 text-gray-300">
            Already have a website? <Link to="/website-builder/import" className="text-theme-primary hover:underline">Import your existing design</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
