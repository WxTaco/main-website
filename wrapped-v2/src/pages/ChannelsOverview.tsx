import { Link } from 'react-router-dom';

const ChannelsOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">Channel Commands</h1>
        <p className="text-lg text-gray-100 mb-8 text-center">Manage and view channel information with these commands.</p>
        <ul className="space-y-4">
          <li><Link to="/channels" className="text-wrapped-pink font-bold hover:underline">Channel Commands</Link> — View channel info, lock/unlock, slowmode, and purge.</li>
        </ul>
      </div>
    </div>
  );
};

export default ChannelsOverview; 