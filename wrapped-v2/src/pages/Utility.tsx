import { Link } from 'react-router-dom';

const Utility = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">Utility Commands</h1>
        <p className="text-lg text-gray-100 mb-8 text-center">All the tools you need to make your server more powerful and user-friendly.</p>
        <ul className="space-y-4">
          <li><Link to="/utility/tickets" className="text-wrapped-pink font-bold hover:underline">Tickets System</Link> — Customizable support tickets with HTML transcripts.</li>
          <li><Link to="/utility/reaction-roles" className="text-wrapped-pink font-bold hover:underline">Reaction Roles</Link> — Let users assign themselves roles with emoji reactions.</li>
          <li><Link to="/utility/welcomer" className="text-wrapped-pink font-bold hover:underline">Welcomer</Link> — Welcome new members with custom messages.</li>
          <li><Link to="/utility/gemini" className="text-wrapped-pink font-bold hover:underline">Google Gemini (AI)</Link> — Generate images and text with AI.</li>
          <li><Link to="/utility/dictionary" className="text-wrapped-pink font-bold hover:underline">Webster Dictionary</Link> — Instantly define any word.</li>
          <li><Link to="/utility/image-gen" className="text-wrapped-pink font-bold hover:underline">Image Generation</Link> — Create a solid color image with a command.</li>
        </ul>
      </div>
    </div>
  );
};

export default Utility; 