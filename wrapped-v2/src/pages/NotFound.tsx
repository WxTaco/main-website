import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-xl w-full bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg p-10 border border-theme-border/30 dark:bg-black/80 dark:border-white/20 text-center">
        <h1 className="text-7xl font-extrabold text-theme-primary mb-4 drop-shadow">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-100 mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="text-theme-primary font-bold hover:underline text-lg">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound;