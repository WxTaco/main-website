import { Link } from 'react-router-dom';

const ChannelCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Channel Commands</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Manage and view channel information, lock/unlock channels, set slowmode, and purge messages with ease.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Available Commands</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li><span className="font-bold">/channel info</span> — View detailed information about a channel.</li>
          <li><span className="font-bold">/channel lock</span> — Lock a channel to prevent typing.</li>
          <li><span className="font-bold">/channel unlock</span> — Unlock a channel to allow typing.</li>
          <li><span className="font-bold">/channel slowmode</span> — Set a slowmode delay for a channel.</li>
          <li><span className="font-bold">/purge</span> — Bulk delete user or bot messages.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ChannelCommands; 