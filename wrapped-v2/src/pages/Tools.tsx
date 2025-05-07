import { Link } from 'react-router-dom';

// Define TypeScript interfaces
interface Tool {
  title: string;
  description: string;
  link: string;
  icon: JSX.Element;
  status: 'available' | 'coming-soon';
  beta?: boolean;
}

const Tools = () => {
  const tools: Tool[] = [
    {
      title: "Discord Bot Builder",
      description: "Create your own Discord bot with our visual block-based builder! No coding experience required - just drag, drop, and connect blocks to build your perfect bot. (Currently in development and not fully functional)",
      link: "/bot-builder",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "Website Builder",
      description: "Create your own website with our visual block-based builder! Drag and drop components to design beautiful, responsive websites without writing a single line of code. (Currently in development and not fully functional)",
      link: "/website-builder",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "JSON Debugger",
      description: "Validate, format, and debug your JSON data with our powerful JSON debugging tool. Easily identify errors and fix issues in your JSON structures.",
      link: "/tools/json-debugger",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "Discord Embed Builder",
      description: "Design beautiful Discord embeds with our visual editor. Customize colors, add fields, and preview your embeds in real-time before sending them to your server.",
      link: "/tools/discord-embed-builder",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "API Tester",
      description: "Test your API endpoints with our intuitive API testing tool. Send requests, view responses, and debug your APIs with ease.",
      link: "/tools/api-tester",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "Color Palette Generator",
      description: "Generate beautiful color palettes for your projects. Export in various formats and find the perfect colors for your designs.",
      link: "/tools/color-palette-generator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "Text Tools",
      description: "A comprehensive collection of text manipulation tools. Convert case, transform text, encode/decode, clean up text, and analyze statistics.",
      link: "/tools/text-case-converter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "CSS Generator",
      description: "Generate CSS code for common UI elements, animations, and layouts. Preview in real-time and copy the code directly into your projects.",
      link: "/tools/css-generator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "Markdown Editor",
      description: "Create and edit Markdown documents with our feature-rich editor. Live preview, syntax highlighting, and export to multiple formats.",
      link: "/tools/markdown-editor",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
    {
      title: "SVG Editor",
      description: "Create and edit SVG graphics with our intuitive visual editor. Perfect for icons, illustrations, and animations for your web projects.",
      link: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: 'coming-soon'
    },
    {
      title: "Code Formatter",
      description: "Format and beautify your code with support for multiple languages. Customize formatting rules and export clean, consistent code.",
      link: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      status: 'coming-soon'
    },
    {
      title: "Database Schema Designer",
      description: "Design database schemas visually with our intuitive drag-and-drop interface. Generate SQL scripts and documentation for your database.",
      link: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      status: 'coming-soon'
    },
    {
      title: "Image Optimizer",
      description: "Optimize images for the web with our powerful compression tool. Reduce file sizes without sacrificing quality for faster loading websites.",
      link: "/tools/image-optimizer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: 'available',
      beta: true
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          Development Tools
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Explore our growing collection of powerful development tools designed to make your workflow easier and more efficient. From building Discord bots to creating websites, optimizing images, and designing database schemas, we're building a comprehensive toolkit for developers!
          </p>
        </section>
      </div>

      {/* Tools Grid */}
      <div className="w-full max-w-6xl mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="bg-theme-primary p-2 rounded-md mr-3">
                {tool.icon}
              </div>
              <h2 className="text-2xl font-saira text-theme-primary font-semibold drop-shadow">
                {tool.title}
              </h2>
              {tool.status === 'coming-soon' && (
                <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                  COMING SOON
                </span>
              )}
              {tool.beta && tool.status === 'available' && (
                <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  BETA
                </span>
              )}
            </div>
            <p className="text-gray-100 mb-6 flex-grow">
              {tool.description}
            </p>
            <div className="flex justify-center">
              {tool.status === 'available' ? (
                <Link
                  to={tool.link}
                  className="inline-flex items-center bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">Open Tool</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-md cursor-not-allowed"
                >
                  <span className="mr-2">Coming Soon</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tools;
