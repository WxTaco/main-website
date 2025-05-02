import { Link } from 'react-router-dom';

const ticketCommands = [
  { 
    name: '/ticket panel', 
    description: 'Create a simple ticket panel with customizable title, description, and support role.',
    link: '/utility/tickets#panel'
  },
  { 
    name: '/ticket config create', 
    description: 'Create a personal ticket configuration that you can reuse later.',
    link: '/utility/tickets#config-create'
  },
  { 
    name: '/ticket config send', 
    description: 'Send one of your saved ticket configurations to a channel.',
    link: '/utility/tickets#config-send'
  },
  { 
    name: '/ticket config list', 
    description: 'List all your saved ticket configurations.',
    link: '/utility/tickets#config-list'
  },
  { 
    name: '/ticket config view', 
    description: 'View details of one of your saved ticket configurations.',
    link: '/utility/tickets#config-view'
  },
  { 
    name: '/ticket config delete', 
    description: 'Delete one of your saved ticket configurations.',
    link: '/utility/tickets#config-delete'
  }
];

const TicketsOverview = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Tickets Commands Overview</h1>
        <p className="text-lg text-white mb-6 text-center">Create and manage support tickets with these powerful commands.</p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20">
            <Link to="/utility/tickets" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-1 px-3 rounded-md border border-wrapped-pink/50 transition-all duration-200 mb-2">
              <span className="mr-1">Tickets System</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-pink-200">Comprehensive ticket system with HTML transcripts and customizable configurations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticketCommands.slice(0, 2).map((cmd) => (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticketCommands.slice(2, 4).map((cmd) => (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticketCommands.slice(4, 6).map((cmd) => (
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

export default TicketsOverview;
