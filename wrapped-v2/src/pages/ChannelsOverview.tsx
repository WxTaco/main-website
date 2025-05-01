import { Link } from 'react-router-dom';

const ChannelsOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Channel Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Manage and view channel information with these commands.</p>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li><Link to="/channels/commands" className="text-wrapped-pink font-bold hover:underline">Channel Commands</Link> — View channel info, lock/unlock, slowmode, and purge.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ChannelsOverview; 