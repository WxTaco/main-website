import { Link } from 'react-router-dom';

const Moderation = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Moderation Tools</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Keep your server safe and friendly with our suite of moderation commands. Manage users and enforce rules with ease.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Available Commands</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li><span className="font-bold">/ban</span> — Ban a user from the server.</li>
          <li><span className="font-bold">/kick</span> — Remove a user from the server.</li>
          <li><span className="font-bold">/mute</span> — Temporarily prevent a user from speaking.</li>
          <li><span className="font-bold">/unmute</span> — Restore a muted user's ability to speak.</li>
          <li><span className="font-bold">/warn</span> — Issue a warning to a user.</li>
          <li><span className="font-bold">/clear</span> — Bulk delete messages in a channel.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Moderation; 