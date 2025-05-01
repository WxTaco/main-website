import { Link } from 'react-router-dom';

const UserCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">User Commands</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          View detailed information about any user in your server with easy-to-use commands.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Available Commands</h2>
        <ul className="list-disc ml-6 mb-6 text-gray-200">
          <li><span className="font-bold">/user info</span> — View general information about a user.</li>
          <li><span className="font-bold">/user avatar</span> — View a user's avatar.</li>
          <li><span className="font-bold">/user roles</span> — List all roles assigned to a user.</li>
          <li><span className="font-bold">/user joined</span> — See when a user joined the server.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default UserCommands; 