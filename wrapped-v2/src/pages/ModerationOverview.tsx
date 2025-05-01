import { Link } from 'react-router-dom';

const ModerationOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">Moderation Commands</h1>
        <p className="text-lg text-gray-100 mb-8 text-center">Keep your server safe and friendly with these moderation tools.</p>
        <ul className="space-y-4">
          <li><Link to="/moderation" className="text-wrapped-pink font-bold hover:underline">Moderation Tools</Link> — Ban, kick, mute, warn, clear, and more.</li>
          <li><Link to="/channels" className="text-wrapped-pink font-bold hover:underline">Channel Lock/Unlock & Slowmode</Link> — Control who can type and set slowmode in channels.</li>
          <li><Link to="/channels" className="text-wrapped-pink font-bold hover:underline">Purge Command</Link> — Bulk delete user or bot messages.</li>
        </ul>
      </div>
    </div>
  );
};

export default ModerationOverview; 