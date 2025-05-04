import { Link } from 'react-router-dom';

const serverCommand = {
  name: '/server',
  description: 'Server-related commands.',
  subcommands: [
    {
      name: 'overview',
      description: 'View general information about the server.',
      details: 'Displays server name, ID, owner, member count, role count, channel count, creation date, boost level, and boost count in an embed with the server icon as a thumbnail.'
    },
    {
      name: 'owner',
      description: 'View information about the server owner.',
      details: 'Shows the server owner\'s username, ID, server join date, and account creation date in an embed with their avatar as a thumbnail.'
    },
    {
      name: 'roles',
      description: 'View all roles in the server with respect to the role hierarchy.',
      details: 'Lists all server roles (excluding @everyone) in order of hierarchy. For servers with many roles, results are paginated with reaction controls to navigate between pages.'
    },
    {
      name: 'invites',
      description: 'View all invites in the server.',
      details: 'Shows all active server invites including the invite code, creator, creation date, expiration date, and usage count.'
    },
    {
      name: 'boosts',
      description: 'View information about server boosts and boosters.',
      details: 'Displays the server\'s boost level, total boost count, and a list of all members who are currently boosting the server. For servers with many boosters, results are paginated.'
    },
    {
      name: 'avatar',
      description: 'Get the server avatar.',
      details: 'Shows the server\'s icon/avatar in full size (4096px) in an embed.'
    },
    {
      name: 'banner',
      description: 'Get the server banner.',
      details: 'Shows the server\'s banner in full size (4096px) in an embed. Will notify if the server doesn\'t have a banner.'
    },
    {
      name: 'splash',
      description: 'Get the server splash image.',
      details: 'Shows the server\'s splash/invite background image in full size (4096px) in an embed. Will notify if the server doesn\'t have a splash image.'
    }
  ]
};

const ServerCommands = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Server Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          Get all the info you need about your server! View general info, owner details, boosters, invites, roles, and server images.
        </p>

        <div className="themed-card mb-6">
          <h2 className="themed-subtitle mb-3">{serverCommand.name}</h2>
          <p className="themed-text mb-4">{serverCommand.description}</p>

          <h3 className="text-xl font-semibold text-white mb-3">Subcommands</h3>
          <div className="space-y-6">
            {serverCommand.subcommands.map((sub) => (
              <div key={sub.name} id={`server-${sub.name}`} className="border-l-2 border-theme-primary pl-4">
                <h4 className="text-lg font-semibold text-theme-primary mb-2">/server {sub.name}</h4>
                <p className="themed-text mb-3">{sub.description}</p>

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
            <p><code className="bg-black/30 px-2 py-1 rounded">/server overview</code> — View general information about your server</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/server roles</code> — See all roles in your server with their hierarchy</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/server banner</code> — Display your server's banner in full size</p>
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

export default ServerCommands;