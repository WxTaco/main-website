import { Link } from 'react-router-dom';

const moderationCommands = [
  {
    name: '/ban',
    description: 'Ban a user from the server.'
  },
  {
    name: '/kick',
    description: 'Remove a user from the server.'
  },
  {
    name: '/timeout',
    description: 'Timeout a user for a specified duration.',
    details: 'Prevents a user from sending messages, adding reactions, joining voice channels, or using voice activity.',
    options: [
      { name: 'user', description: 'The user to timeout', required: true },
      { name: 'seconds', description: 'Duration in seconds (10, 30, or 60)', required: false },
      { name: 'minutes', description: 'Duration in minutes (5, 15, or 30)', required: false },
      { name: 'hours', description: 'Duration in hours (6, 12, or 24)', required: false }
    ],
    example: 'Use /timeout @user minutes:15 to timeout a user for 15 minutes.'
  },
  {
    name: '/nickname',
    description: 'Change a user\'s nickname.',
    details: 'Allows moderators to change the display name of users in the server.',
    options: [
      { name: 'user', description: 'The user whose nickname to change', required: true },
      { name: 'nickname', description: 'The new nickname', required: true }
    ],
    permission: 'Manage Nicknames',
    example: 'Use /nickname @user "New Nickname" to change someone\'s server nickname.'
  },
  {
    name: '/mute',
    description: 'Temporarily prevent a user from speaking.'
  },
  {
    name: '/unmute',
    description: 'Restore a muted user\'s ability to speak.'
  },
  {
    name: '/warn',
    description: 'Issue a warning to a user.'
  },
  {
    name: '/clear',
    description: 'Bulk delete messages in a channel.'
  }
];

const Moderation = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Moderation Tools</h1>
        <p className="text-lg text-white mb-6 text-center">
          Keep your server safe and friendly with our suite of moderation commands. Manage users and enforce rules with ease.
        </p>

        <h2 className="text-2xl font-bold text-wrapped-pink mb-4">Available Commands</h2>
        <div className="space-y-4 mb-6">
          {moderationCommands.map((cmd) => (
            <div key={cmd.name} id={cmd.name.replace('/', '')} className={`${cmd.details ? 'bg-gray-900/50 p-4 rounded-lg border border-white/10' : ''}`}>
              <h3 className="text-lg font-bold text-wrapped-pink mb-1">{cmd.name}</h3>
              <p className="text-pink-200 mb-1">{cmd.description}</p>

              {cmd.permission && (
                <p className="text-pink-200 mb-1">
                  <span className="text-white font-semibold">Required Permission:</span> {cmd.permission}
                </p>
              )}

              {cmd.options && cmd.options.length > 0 && (
                <>
                  <h4 className="text-white font-medium mt-2 mb-1">Options:</h4>
                  <ul className="list-disc ml-6 mb-2 text-pink-200">
                    {cmd.options.map(opt => (
                      <li key={opt.name}>
                        <span className="font-semibold">{opt.name}</span> — {opt.description}
                        {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {cmd.details && (
                <>
                  <h4 className="text-white font-medium mt-2 mb-1">Details:</h4>
                  <p className="text-pink-200 ml-2">{cmd.details}</p>
                </>
              )}

              {cmd.example && (
                <p className="text-pink-200 italic mt-2 text-sm">{cmd.example}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-2 px-4 rounded-md border border-wrapped-pink/50 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Moderation;