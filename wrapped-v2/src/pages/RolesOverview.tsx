import { Link } from 'react-router-dom';

const roleCommands = [
  {
    name: '/role view',
    description: 'View detailed information about a role (ID, color, members count, mentionable status, position).',
    link: '/roles/commands#role-view'
  },
  {
    name: '/role edit',
    description: 'Edit a role\'s name and color (requires Manage Roles permission).',
    link: '/roles/commands#role-edit'
  },
  {
    name: '/role members',
    description: 'List all members with a specific role, with optional status filtering (online, offline, idle, dnd).',
    link: '/roles/commands#role-members'
  },
];

const RolesOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Role Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Manage and view roles with these powerful commands.</p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/roles/commands" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Role Commands</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">View, edit, and manage roles with the /role command.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roleCommands.map((cmd) => (
              <div key={cmd.name} className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
                <Link to={cmd.link} className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
                  <span className="mr-1">{cmd.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="text-pink-200">{cmd.description}</p>
              </div>
            ))}
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

export default RolesOverview;