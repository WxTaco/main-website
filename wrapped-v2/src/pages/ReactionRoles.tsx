import LegalPage from '../components/LegalPage';
import { Link } from 'react-router-dom';

const ReactionRoles = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#7b2869] via-fuchsia-700 to-purple-900 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/20">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Reaction Roles</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Let your server members assign roles to themselves by reacting to a message! Reaction Roles make it easy to manage access to channels, notifications, and more—all with a simple emoji click.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">How It Works</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li>Admins set up a message and assign emojis to specific roles.</li>
          <li>Members react to the message with the emoji of their choice.</li>
          <li>The bot automatically assigns or removes the corresponding role.</li>
        </ul>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Why Use Reaction Roles?</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li>Empower users to personalize their experience.</li>
          <li>Automate role management and reduce admin workload.</li>
          <li>Great for color roles, notification pings, access to special channels, and more!</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ReactionRoles; 