import { Link } from 'react-router-dom';

const Home = () => {
  const modules = [
    {
      title: 'Utility',
      features: [
        { name: 'Tickets System', link: '/utility/tickets' },
        { name: 'Reaction Roles', link: '/utility/reaction-roles' },
        { name: 'Welcomer', link: '/utility/welcomer' },
        { name: 'Google Gemini (AI)', link: '/utility/gemini' },
        { name: 'Webster Dictionary', link: '/utility/dictionary' },
        { name: 'Image Generation', link: '/utility/image-gen' },
      ],
    },
    {
      title: 'Moderation',
      features: [
        { name: 'Moderation Tools', link: '/moderation' },
        { name: 'Channel Lock/Unlock & Slowmode', link: '/channels' },
        { name: 'Purge Command', link: '/channels' },
      ],
    },
    {
      title: 'Roles',
      features: [
        { name: '/role members', description: 'View the members of a role.' },
        { name: '/role edit', description: 'Edit the properties of a role (name, color, permissions, etc).' },
        { name: '/role view', description: 'View info about the role, such as member count, color, hierarchy position, and more.' },
        { name: '/role add', description: 'Add the role to a user.' },
        { name: '/role remove', description: 'Remove the role from a user.' },
        { name: '/role delete', description: 'Delete a role.' },
        { name: '/role create', description: 'Create a new role.' },
        { name: 'More Role Commands...', link: '/roles' },
      ],
    },
    {
      title: 'Server',
      features: [
        { name: 'Server Commands', link: '/server' },
      ],
    },
    {
      title: 'Channels',
      features: [
        { name: 'Channel Commands', link: '/channels' },
      ],
    },
    {
      title: 'Users',
      features: [
        { name: 'User Commands', link: '/users' },
      ],
    },
    {
      title: 'Leveling',
      features: [{ name: 'Coming Soon...', link: '#' }],
    },
    {
      title: 'Economy',
      features: [{ name: 'Coming Soon...', link: '#' }],
    },
    {
      title: 'Giveaways',
      features: [{ name: 'Coming Soon...', link: '#' }],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30 mb-8">
        <h1 className="text-6xl md:text-7xl font-extrabold font-saira text-wrapped-pink drop-shadow-lg mb-4 text-center">
          Wrapped V2
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            <span className="text-wrapped-yellow font-bold">Wrapped</span> is our version of a{' '}
            <span className="text-wrapped-green font-bold">multi-purpose</span> discord bot designed with{' '}
            <span className="text-wrapped-blue font-bold">you</span> in mind! We are dedicated to developing
            a bot that has the best user experience possible, and we accomplish that by putting{' '}
            <span className="text-wrapped-green font-bold">you</span>, the user, first!
          </p>
          <div className="bg-gray-900/80 rounded-lg p-4 mt-6 border border-wrapped-pink">
            <p className="text-lg text-wrapped-pink font-bold text-center">
              <span className="text-white">We have</span> <span className="underline">no current plans to lock any features behind a paywall</span> <span className="text-white">on Wrapped V2. All features are free for everyone!</span>
            </p>
          </div>
        </section>
      </div>

      {/* Modules Section */}
      <section className="w-full max-w-6xl">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/20">
          <h2 className="text-3xl font-saira text-wrapped-pink text-center mb-8 font-semibold drop-shadow">
            Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.title}
                className="bg-gray-900/80 rounded-lg shadow p-6 border border-white/30"
              >
                <h3 className="text-xl font-saira mb-4 text-gray-100 font-bold">{module.title}</h3>
                <ul className="space-y-2">
                  {module.features.map((feature) => (
                    <li key={feature.name}>
                      {feature.link ? (
                        <Link
                          to={feature.link}
                          className="text-gray-200 hover:text-wrapped-pink transition-colors font-medium"
                        >
                          {feature.name}
                        </Link>
                      ) : feature.description ? (
                        <span className="text-gray-200 font-medium">
                          <span className="font-bold">{feature.name}</span> — {feature.description}
                        </span>
                      ) : (
                        <span className="text-gray-200 font-medium">{feature.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 