import { Link } from 'react-router-dom';


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
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-6xl md:text-7xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          Wrapped V2
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            <span className="text-wrapped-yellow font-bold">Wrapped</span> is evolving into your go-to platform for{' '}
            <span className="text-wrapped-blue font-bold">web services</span> and{' '}
            <span className="text-wrapped-green font-bold">development tools</span>! We're expanding our focus to provide you with powerful utilities that make development easier and more efficient.
          </p>
          <div className="bg-gray-900/90 rounded-lg p-4 mt-6 border border-theme-primary/30 dark:bg-black/60">
            <p className="text-lg text-theme-primary font-bold text-center">
              <span className="text-white">Check out our new</span> <Link to="/tools" className="underline hover:text-wrapped-blue">Tools section</Link> <span className="text-white">for our growing collection of development utilities!</span>
            </p>
          </div>
        </section>
      </div>

      {/* Important Announcement from Switchy */}
      <div className="w-full max-w-5xl mb-8">
        <div className="bg-red-900/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-red-500/50 dark:bg-red-950/80 dark:border-red-400/30">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
              IMPORTANT
            </div>
            <h2 className="text-2xl font-saira text-red-300 font-semibold">Message from Switchy - Our Artist & Long-Time Friend</h2>
          </div>

          <div className="text-gray-100 space-y-4">
            <p>
              Switchy, our talented artist and long-time friend, is going through an incredibly difficult time. She has been struggling with serious health issues for a very long time, and her situation has recently become critical as she has become homeless with no means of support.
            </p>

            <p>
              Her health has been declining at an alarming rate, and she can no longer face this alone. We're reaching out to our community to ask for your help. If you're able to contribute to her GoFundMe, any amount would make a meaningful difference. More details about her situation can be found on the fundraising page.
            </p>

            <div className="bg-red-800/50 rounded-lg p-4 border border-red-400/30">
              <a
                href="https://gofund.me/15e7cea8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Support Switchy's GoFundMe
              </a>
            </div>

            <p className="text-sm text-gray-300">
              Switchy has contributed so much to Wrapped and her projects over the last year, and now she's looking to that community for help. Any amount would mean the world.
            </p>

            <p className="text-right text-red-300 font-medium italic">
              ~ The Wrapped Team
            </p>
          </div>
        </div>
      </div>

      {/* Development Focus Card */}
      <div className="w-full max-w-5xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20 flex flex-col">
          <h2 className="text-3xl font-saira text-theme-primary mb-4 font-semibold drop-shadow text-center">Why Wrapped V2?</h2>
          <p className="text-gray-100 mb-6">
            Wrapped V2 is your all-in-one Discord bot, packed with powerful features for server management, moderation, fun, and utility. Alongside the bot, we offer a growing suite of development tools to help you build, debug, and optimize your projects. Whether you're running a community or developing new ideas, Wrapped V2 is here to make your workflow easier and more efficient.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/90 rounded-lg p-4 border border-theme-primary/30">
              <h3 className="text-xl font-saira text-wrapped-blue mb-2">Discord Bot Features</h3>
              <p className="text-gray-200">
                Manage your server with advanced moderation, ticketing, role management, and fun commands. Wrapped V2 is designed to be your server's best friend.
              </p>
            </div>
            <div className="bg-gray-900/90 rounded-lg p-4 border border-theme-primary/30">
              <h3 className="text-xl font-saira text-wrapped-green mb-2">Development Tools</h3>
              <p className="text-gray-200">
                Explore utilities like JSON debugging, embed building, image optimization, and more—created to streamline your development process.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              to="/tools"
              className="inline-flex items-center bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">Explore Our Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="w-full max-w-7xl">
        {categories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-10">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
              <h2 className="text-2xl font-saira text-theme-primary mb-6 font-semibold drop-shadow">
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
                {category.modules.map((module) => (
                  <div
                    key={module.title}
                    className="bg-gray-900/90 rounded-lg shadow p-4 border border-theme-border/30 min-h-[180px] flex flex-col dark:bg-black/70 dark:border-white/20"
                  >
                    <h3 className="text-lg font-saira mb-2 text-gray-100 font-bold">{module.title}</h3>
                    <div className="space-y-2 flex-grow">
                      {module.features.map((feature) => (
                        <div key={feature.name}>
                          {feature.link ? (
                            <div className="mb-1.5">
                              <Link
                                to={feature.link}
                                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-theme-primary font-bold py-0.5 px-2 text-sm rounded-md border border-theme-primary/30 transition-all duration-200 dark:bg-black/60 dark:hover:bg-gray-900"
                              >
                                <span>{feature.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </Link>
                            </div>
                          ) : feature.description ? (
                            <div className="text-gray-200 font-medium">
                              <span className="font-bold text-theme-primary">{feature.name}</span> — {feature.description}
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