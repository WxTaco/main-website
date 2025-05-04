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
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">User Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          View detailed information about any user in your server with easy-to-use commands.
        </p>

        <div className="themed-card mb-6">
          <h2 className="themed-subtitle mb-3">{userCommand.name}</h2>
          <p className="themed-text mb-4">{userCommand.description}</p>

          <h3 className="text-xl font-semibold text-white mb-3">Subcommands</h3>
          <div className="space-y-6">
            {userCommand.subcommands.map((sub) => (
              <div key={sub.name} id={`user-${sub.name}`} className="border-l-2 border-theme-primary pl-4">
                <h4 className="text-lg font-semibold text-theme-primary mb-2">/user {sub.name}</h4>
                <p className="themed-text mb-3">{sub.description}</p>

                {sub.options && sub.options.length > 0 && (
                  <>
                    <h5 className="text-white font-medium mb-2">Options:</h5>
                    <ul className="list-disc ml-6 mb-3 themed-text">
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
                  <div className="bg-black/20 p-3 rounded mt-2 border border-theme-border/20">
                    <p className="themed-text text-sm">{sub.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="themed-card mb-6">
          <h3 className="text-lg font-semibold text-theme-primary mb-2">Example Usage</h3>
          <div className="space-y-2 themed-text">
            <p><code className="bg-black/30 px-2 py-1 rounded">/user info target:@username</code> — View detailed information about a specific user</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/user avatar type:server</code> — View your own server-specific avatar</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/user banner target:@username type:public</code> — View a user's public banner</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="themed-button-lg">
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