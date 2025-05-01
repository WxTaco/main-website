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

const RolesOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">Role Commands</h1>
        <p className="text-lg text-gray-100 mb-8 text-center">Manage and view roles with these powerful commands.</p>
        <ul className="space-y-3 mb-6 animate-fade-in">
          {roleCommands.map((cmd, i) => (
            <li key={cmd.name} className="text-gray-200 font-medium transition-opacity duration-500" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="font-bold">{cmd.name}</span> — {cmd.description}
            </li>
          ))}
        </ul>
        <div className="text-center mt-8">
          <Link to="/roles/commands" className="text-wrapped-pink font-bold hover:underline">View Role Command Details</Link>
        </div>
      </div>
    </div>
  );
};

export default RolesOverview; 