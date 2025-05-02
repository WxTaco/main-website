import { Link } from 'react-router-dom';

const ticketCommand = {
  name: '/ticket',
  description: 'Create and manage ticket panels',
  permission: 'Manage Server',
  subcommands: [
    {
      name: 'panel',
      description: 'Create a simple ticket panel',
      options: [
        { name: 'channel', description: 'Channel to send the ticket panel to', required: true },
        { name: 'title', description: 'Title for the ticket panel', required: true },
        { name: 'description', description: 'Description for the ticket panel', required: true },
        { name: 'support_role', description: 'Role to ping when tickets are created', required: false },
        { name: 'ping_support', description: 'Whether to ping the support role when a ticket is created', required: false }
      ],
      details: 'Creates a simple ticket panel with a button that users can click to open tickets.'
    }
  ],
  configSubcommands: [
    {
      name: 'config create',
      description: 'Create a personal ticket configuration',
      options: [
        { name: 'name', description: 'Name for this configuration', required: true },
        { name: 'title', description: 'Title for the ticket panel', required: true },
        { name: 'description', description: 'Description for the ticket panel', required: true },
        { name: 'button_label', description: 'Text to display on the ticket button', required: true },
        { name: 'color', description: 'Color for the embed (hex code)', required: false },
        { name: 'welcome_message', description: 'Message to show when a ticket is opened', required: false }
      ],
      details: 'Creates a saved ticket configuration that you can reuse later.'
    },
    {
      name: 'config send',
      description: 'Send one of your saved ticket configurations to a channel',
      options: [
        { name: 'channel', description: 'Channel to send the ticket panel to', required: true },
        { name: 'config_name', description: 'Name of your saved configuration', required: true }
      ],
      details: 'Sends a previously saved ticket configuration to a channel.'
    },
    {
      name: 'config list',
      description: 'List all your saved ticket configurations',
      details: 'Shows a list of all your saved ticket configurations with an interactive menu to view details.'
    },
    {
      name: 'config view',
      description: 'View details of one of your saved ticket configurations',
      options: [
        { name: 'config_name', description: 'Name of the configuration to view', required: true }
      ],
      details: 'Shows detailed information about a saved ticket configuration with options to send or delete it.'
    },
    {
      name: 'config delete',
      description: 'Delete one of your saved ticket configurations',
      options: [
        { name: 'config_name', description: 'Name of the configuration to delete', required: true }
      ],
      details: 'Deletes a saved ticket configuration after confirmation.'
    }
  ]
};

const Tickets = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Tickets System</h1>
        <p className="text-lg text-white mb-6 text-center">
          Manage support and user requests with our advanced ticket system! Create, track, and resolve tickets with ease. Each ticket can be exported as an HTML transcript for easy record-keeping and sharing.
        </p>

        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">Key Features</h2>
          <ul className="list-disc ml-6 mb-4 text-pink-200">
            <li>Fully customizable ticket panels with saved configurations</li>
            <li>HTML transcripts for every ticket, downloadable and shareable</li>
            <li>Support role pinging and custom welcome messages</li>
            <li>Interactive buttons for users to create tickets</li>
          </ul>
        </div>

        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">{ticketCommand.name}</h2>
          <p className="text-pink-200 mb-4">{ticketCommand.description}</p>
          <p className="text-pink-200 mb-4">
            <span className="text-white font-semibold">Required Permission:</span> {ticketCommand.permission}
          </p>

          <h3 className="text-xl font-semibold text-white mb-3">Simple Panel Creation</h3>
          <div id="panel" className="border-l-2 border-wrapped-pink pl-4 mb-6">
            <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/ticket panel</h4>
            <p className="text-pink-200 mb-3">{ticketCommand.subcommands[0].description}</p>

            <h5 className="text-white font-medium mb-2">Options:</h5>
            <ul className="list-disc ml-6 mb-3 text-pink-200">
              {ticketCommand.subcommands[0].options.map(opt => (
                <li key={opt.name}>
                  <span className="font-semibold">{opt.name}</span> — {opt.description}
                  {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                </li>
              ))}
            </ul>

            <div className="bg-black/20 p-3 rounded mt-2">
              <p className="text-pink-200 text-sm">{ticketCommand.subcommands[0].details}</p>
            </div>

            <div className="bg-gray-800/70 p-3 rounded border border-wrapped-pink/30 mt-4">
              <code className="text-wrapped-pink font-mono">
                /ticket panel channel:#support title:"Support Tickets" description:"Click the button below to create a support ticket" support_role:@Support
              </code>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3">Advanced Configuration</h3>
          <div className="space-y-6">
            {ticketCommand.configSubcommands.map(sub => (
              <div id={`config-${sub.name.split(' ')[1]}`} key={sub.name} className="border-l-2 border-wrapped-pink pl-4">
                <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/ticket {sub.name}</h4>
                <p className="text-pink-200 mb-3">{sub.description}</p>

                {sub.options && sub.options.length > 0 && (
                  <>
                    <h5 className="text-white font-medium mb-2">Options:</h5>
                    <ul className="list-disc ml-6 mb-3 text-pink-200">
                      {sub.options.map(opt => (
                        <li key={opt.name}>
                          <span className="font-semibold">{opt.name}</span> — {opt.description}
                          {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="bg-black/20 p-3 rounded mt-2">
                  <p className="text-pink-200 text-sm">{sub.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-wrapped-pink mb-2">Workflow Example</h3>
          <ol className="list-decimal ml-6 space-y-2 text-pink-200">
            <li>Create a ticket configuration with <code className="bg-black/30 px-2 py-1 rounded">/ticket config create</code></li>
            <li>View your saved configurations with <code className="bg-black/30 px-2 py-1 rounded">/ticket config list</code></li>
            <li>Send your configuration to a channel with <code className="bg-black/30 px-2 py-1 rounded">/ticket config send</code></li>
            <li>Users click the button to create tickets</li>
            <li>Staff can close tickets and generate HTML transcripts</li>
          </ol>
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

export default Tickets;