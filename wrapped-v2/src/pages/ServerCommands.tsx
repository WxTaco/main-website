import { Link } from 'react-router-dom';

const ServerCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Server Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          Get all the info you need about your server! View general info, owner details, boosters, invites, roles, and even the server splash image.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Available Commands</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li><span className="font-bold">/server info</span> — View general server information.</li>
          <li><span className="font-bold">/server owner</span> — See info about the server owner.</li>
          <li><span className="font-bold">/server boosters</span> — List all server boosters.</li>
          <li><span className="font-bold">/server invites</span> — View server invite info.</li>
          <li><span className="font-bold">/server roles</span> — List all server roles.</li>
          <li><span className="font-bold">/server splash</span> — View the server splash image.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ServerCommands; 