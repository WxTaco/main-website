import { Link } from 'react-router-dom';

const userCommand = {
  name: '/user',
  description: 'User-related commands.',
  subcommands: [
    {
      name: 'info',
      description: 'Get information about a user.',
      options: [
        { name: 'target', description: 'The user to get information about (defaults to yourself if not specified).', required: false }
      ],
      details: 'Displays username, ID, join date, account creation date, roles, and status in an embed with the user\'s avatar as a thumbnail.'
    },
    {
      name: 'avatar',
      description: 'Get the avatar of a user.',
      options: [
        { name: 'target', description: 'The user to get the avatar of (defaults to yourself if not specified).', required: false },
        { name: 'type', description: 'Choose avatar type (Public or Server).', required: false, choices: ['Public', 'Server'] }
      ],
      details: 'Shows the user\'s avatar in full size. You can choose between their public avatar or server-specific avatar if they have one.'
    },
    {
      name: 'banner',
      description: 'Get the banner of a user.',
      options: [
        { name: 'target', description: 'The user to get the banner of (defaults to yourself if not specified).', required: false },
        { name: 'type', description: 'Choose banner type (Public or Server).', required: false, choices: ['Public', 'Server'] }
      ],
      details: 'Shows the user\'s banner in full size. You can choose between their public banner or server-specific banner if they have one.'
    }
  ]
};

const UserCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">User Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          View detailed information about any user in your server with easy-to-use commands.
        </p>

        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">{userCommand.name}</h2>
          <p className="text-pink-200 mb-4">{userCommand.description}</p>

          <h3 className="text-xl font-semibold text-white mb-3">Subcommands</h3>
          <div className="space-y-6">
            {userCommand.subcommands.map((sub) => (
              <div key={sub.name} id={`user-${sub.name}`} className="border-l-2 border-wrapped-pink pl-4">
                <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/user {sub.name}</h4>
                <p className="text-pink-200 mb-3">{sub.description}</p>

                {sub.options && sub.options.length > 0 && (
                  <>
                    <h5 className="text-white font-medium mb-2">Options:</h5>
                    <ul className="list-disc ml-6 mb-3 text-pink-200">
                      {sub.options.map((opt) => (
                        <li key={opt.name}>
                          <span className="font-semibold">{opt.name}</span> — {opt.description}
                          {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                          {opt.choices && (
                            <span className="text-wrapped-blue"> (Choices: {opt.choices.join(', ')})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {sub.details && (
                  <div className="bg-black/20 p-3 rounded mt-2">
                    <p className="text-pink-200 text-sm">{sub.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-wrapped-pink mb-2">Example Usage</h3>
          <div className="space-y-2 text-pink-200">
            <p><code className="bg-black/30 px-2 py-1 rounded">/user info target:@username</code> — View detailed information about a specific user</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/user avatar type:server</code> — View your own server-specific avatar</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/user banner target:@username type:public</code> — View a user's public banner</p>
          </div>
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

export default UserCommands;