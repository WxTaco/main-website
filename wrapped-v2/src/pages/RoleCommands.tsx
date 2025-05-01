import { Link } from 'react-router-dom';

const roleCommands = [
  { name: '/role members', description: 'View the members of a role.' },
  { name: '/role edit', description: 'Edit the properties of a role (name, color, permissions, etc).' },
  { name: '/role view', description: 'View info about the role, such as member count, color, hierarchy position, and more.' },
  { name: '/role add', description: 'Add the role to a user.' },
  { name: '/role remove', description: 'Remove the role from a user.' },
  { name: '/role delete', description: 'Delete a role.' },
  { name: '/role create', description: 'Create a new role.' },
];

const RoleCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Role Commands</h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          Manage and view roles with ease! The <span className="font-bold">/role</span> command lets you perform a variety of actions on server roles.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Subcommands</h2>
        <ul className="space-y-3 mb-6">
          {roleCommands.map(cmd => (
            <li key={cmd.name} className="text-gray-200 font-medium">
              <span className="font-bold">{cmd.name}</span> — {cmd.description}
            </li>
          ))}
        </ul>
        <div className="text-center mt-8">
          <Link to="/roles" className="text-wrapped-pink font-bold hover:underline">Back to Roles Overview</Link>
        </div>
      </div>
    </div>
  );
};

export default RoleCommands; 