import { Link } from 'react-router-dom';

// Define TypeScript interfaces
interface Feature {
  name: string;
  link?: string;
  description?: string;
}

interface Module {
  title: string;
  features: Feature[];
}

interface Category {
  title: string;
  modules: Module[];
}

const Home = () => {
  const categories: Category[] = [
    {
      title: "Server Management",
      modules: [
        {
          title: 'Server Info',
          features: [
            { name: '/server overview', link: '/server/commands#server-overview' },
            { name: '/server owner', link: '/server/commands#server-owner' },
            { name: '/server roles', link: '/server/commands#server-roles' },
            { name: '/server boosts', link: '/server/commands#server-boosts' },
            { name: '/server invites', link: '/server/commands#server-invites' },
            { name: '/server avatar', link: '/server/commands#server-avatar' },
            { name: '/server banner', link: '/server/commands#server-banner' },
            { name: '/server splash', link: '/server/commands#server-splash' },
          ],
        },
        {
          title: 'Channel Controls',
          features: [
            { name: '/channelinfo', link: '/channels/commands#channelinfo' },
            { name: '/lock', link: '/channels/commands#lock' },
            { name: '/unlock', link: '/channels/commands#unlock' },
            { name: '/slowmode', link: '/channels/commands#slowmode' },
            { name: '/purge', link: '/channels/commands#purge' },
          ],
        },
        {
          title: 'Role Management',
          features: [
            { name: '/role view', link: '/roles/commands#role-view' },
            { name: '/role edit', link: '/roles/commands#role-edit' },
            { name: '/role members', link: '/roles/commands#role-members' },
          ],
        },
        {
          title: 'Moderation',
          features: [
            { name: '/timeout', link: '/moderation/tools#timeout' },
            { name: '/nickname', link: '/moderation/tools#nickname' },
            { name: '/ban', link: '/moderation/tools#ban' },
            { name: '/kick', link: '/moderation/tools#kick' },
          ],
        },
      ]
    },
    {
      title: "Utility & Features",
      modules: [
        {
          title: 'Tickets',
          features: [
            { name: '/ticket panel', link: '/tickets#panel' },
            { name: '/ticket config create', link: '/tickets#config-create' },
            { name: '/ticket config send', link: '/tickets#config-send' },
            { name: '/ticket config list', link: '/tickets#config-list' },
          ],
        },
        {
          title: 'Reaction Roles',
          features: [
            { name: '/reaction-role add', link: '/utility/reaction-roles' },
            { name: '/reaction-role remove', link: '/utility/reaction-roles' },
            { name: '/reaction-role list', link: '/utility/reaction-roles' },
          ],
        },
        {
          title: 'Welcomer',
          features: [
            { name: '/welcomer setup', link: '/utility/welcomer' },
            { name: '/welcomer message', link: '/utility/welcomer' },
            { name: '/welcomer test', link: '/utility/welcomer' },
          ],
        },
        {
          title: 'User Commands',
          features: [
            { name: '/user info', link: '/users/commands#user-info' },
            { name: '/user avatar', link: '/users/commands#user-avatar' },
            { name: '/user banner', link: '/users/commands#user-banner' },
          ],
        },
      ]
    },
    {
      title: "Fun & Tools",
      modules: [
        {
          title: 'Fun Commands',
          features: [
            { name: '/fun joke', link: '/fun/commands#fun-joke' },
            { name: '/fun meme', link: '/fun/commands#fun-meme' },
            { name: '/fun 8ball', link: '/fun/commands#fun-8ball' },
          ],
        },
        {
          title: 'AI & Tools',
          features: [
            { name: '/gemini', link: '/utility/gemini' },
            { name: '/dictionary', link: '/utility/dictionary' },
            { name: '/single-color-image', link: '/utility/image-gen' },
          ],
        },
        {
          title: 'Coming Soon',
          features: [
            { name: 'Leveling', link: '#' },
            { name: 'Economy', link: '#' },
            { name: 'Giveaways', link: '#' },
          ],
        },
      ]
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

      {/* Categories Section */}
      <section className="w-full max-w-7xl">
        {categories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-10">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20">
              <h2 className="text-2xl font-saira text-wrapped-pink mb-6 font-semibold drop-shadow">
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
                {category.modules.map((module) => (
                  <div
                    key={module.title}
                    className="bg-gray-900/80 rounded-lg shadow p-4 border border-white/30 min-h-[180px] flex flex-col"
                  >
                    <h3 className="text-lg font-saira mb-2 text-gray-100 font-bold">{module.title}</h3>
                    <div className="space-y-2 flex-grow">
                      {module.features.map((feature) => (
                        <div key={feature.name}>
                          {feature.link ? (
                            <div className="mb-1.5">
                              <Link
                                to={feature.link}
                                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-0.5 px-2 text-sm rounded-md border border-wrapped-pink/30 transition-all duration-200"
                              >
                                <span>{feature.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </Link>
                            </div>
                          ) : feature.description ? (
                            <div className="text-gray-200 font-medium">
                              <span className="font-bold text-wrapped-pink">{feature.name}</span> — {feature.description}
                            </div>
                          ) : (
                            <div className="text-gray-200 font-medium">{feature.name}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;