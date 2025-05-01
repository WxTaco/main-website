import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7b2869] via-fuchsia-700 to-purple-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg p-10 border border-white/20 text-center">
        <h1 className="text-7xl font-extrabold text-wrapped-pink mb-4 drop-shadow">404</h1>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="text-wrapped-pink font-bold hover:underline text-lg">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound; 