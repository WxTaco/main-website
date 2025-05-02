import { Link } from 'react-router-dom';

const Welcomer = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Welcomer</h1>
        <p className="text-lg text-white mb-6 text-center">
          Make every new member feel special! The Welcomer feature sends a personalized welcome message when someone joins your server, helping them feel at home right away.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">How It Works</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li>Admins configure a welcome message and select a channel.</li>
          <li>When a new member joins, the bot sends the message automatically.</li>
          <li>Supports custom images, embeds, and dynamic user/server info.</li>
        </ul>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Why Use Welcomer?</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li>Creates a friendly, inviting atmosphere for newcomers.</li>
          <li>Helps new members find important info and rules quickly.</li>
          <li>Can be customized to match your server's style and branding.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcomer;