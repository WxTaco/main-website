import { Link } from 'react-router-dom';

const roleCommands = [
  {
    name: '/role view',
    description: 'View detailed information about a role.',
    options: [
      { name: 'role', description: 'The role to view (required)' }
    ],
    details: 'Displays role ID, color, member count, mentionable status, and position in the role hierarchy.'
  },
  {
    name: '/role edit',
    description: 'Edit a role\'s properties.',
    options: [
      { name: 'role', description: 'The role to edit (required)' },
      { name: 'name', description: 'The new name for the role (optional)' },
      { name: 'color', description: 'The new color for the role as hex code (optional)' }
    ],
    details: 'Requires the Manage Roles permission. You can change the name and/or color of a role.'
  },
  {
    name: '/role members',
    description: 'List all members with a specific role.',
    options: [
      { name: 'role', description: 'The role to list members for (required)' },
      { name: 'status', description: 'Filter members by status: online, offline, idle, dnd (optional)' }
    ],
    details: 'Shows a paginated list of members with the specified role. Use the reactions to navigate between pages. You can optionally filter by member status.'
  }
];

const RoleCommands = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Role Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          Manage and view roles with ease! The <span className="font-bold">/role</span> command lets you perform a variety of actions on server roles.
        </p>
        <h2 className="themed-subtitle mb-4">Subcommands</h2>
        <div className="space-y-8 mb-6 animate-fade-in">
          {roleCommands.map((cmd, i) => (
            <div id={`role-${cmd.name.split('/')[1].split(' ')[1]}`} key={cmd.name} className="themed-card themed-text font-medium transition-opacity duration-500" style={{ animationDelay: `${i * 60}ms` }}>
              <h3 className="text-xl font-bold text-theme-primary mb-2">{cmd.name}</h3>
              <p className="mb-3">{cmd.description}</p>

              {cmd.options && cmd.options.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold text-white mb-2">Options:</h4>
                  <ul className="list-disc ml-6 mb-3 themed-text">
                    {cmd.options.map(option => (
                      <li key={option.name}>
                        <span className="font-semibold">{option.name}</span> — {option.description}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {cmd.details && (
                <>
                  <h4 className="text-lg font-semibold text-white mb-2">Details:</h4>
                  <p className="themed-text">{cmd.details}</p>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/roles" className="themed-button-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Roles Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleCommands;