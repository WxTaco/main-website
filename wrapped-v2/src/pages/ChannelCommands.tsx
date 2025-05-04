import { Link } from 'react-router-dom';

const channelCommands = [
  {
    name: '/channelinfo',
    description: 'Get information about the current channel.',
    details: 'Displays channel ID, type, and creation date in an embed.',
    example: 'Use this command in any channel to see its details.'
  },
  {
    name: '/lock',
    description: 'Lock the current channel to prevent users from sending messages.',
    details: 'Modifies channel permissions to prevent the @everyone role from sending messages.',
    options: [
      { name: 'reason', description: 'The reason for locking the channel (optional)' }
    ],
    permission: 'Manage Channels',
    example: 'Use /lock raid to lock a channel during a raid.'
  },
  {
    name: '/unlock',
    description: 'Unlock the current channel to allow users to send messages.',
    details: 'Removes the SendMessages permission override for the @everyone role.',
    permission: 'Manage Channels',
    example: 'Use /unlock to restore normal messaging permissions.'
  },
  {
    name: '/slowmode',
    description: 'Set a slowmode timer for the current channel.',
    details: 'Sets the rate limit per user for the channel. When slowmode is enabled, users must wait for the specified duration before sending another message.',
    options: [
      { name: 'duration', description: 'The duration of the slowmode in seconds (0 to disable, max 21600 seconds/6 hours).', required: true }
    ],
    permission: 'Manage Channels',
    example: 'Use /slowmode 5 to set a 5-second cooldown between messages, or /slowmode 0 to disable slowmode.'
  }
];

const purgeCommand = {
  name: '/purge',
  description: 'Delete messages from the channel.',
  permission: 'Manage Messages',
  subcommands: [
    {
      name: 'messages',
      description: 'Delete a number of messages in this channel.',
      options: [
        { name: 'amount', description: 'The number of messages to delete (1-100).', required: true },
        { name: 'user', description: 'The user whose messages to delete (optional).', required: false }
      ],
      details: 'Deletes the specified number of messages. If a user is specified, only deletes messages from that user. Messages older than 2 weeks will be deleted individually.'
    },
    {
      name: 'bot',
      description: 'Delete a number of recent bot messages.',
      options: [
        { name: 'amount', description: 'The number of bot messages to delete (1-100).', required: true }
      ],
      details: 'Deletes the specified number of bot messages. Messages older than 2 weeks will be deleted individually.'
    }
  ]
};

const ChannelCommands = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Channel Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          Manage and view channel information, lock/unlock channels, set slowmode, and purge messages with ease.
        </p>

        <h2 className="themed-subtitle mb-3">Channel Management</h2>
        <div className="space-y-4 mb-6">
          {channelCommands.map((cmd) => (
            <div id={cmd.name.replace('/', '')} key={cmd.name} className={`${cmd.details ? 'themed-card' : ''}`}>
              <h3 className="text-lg font-bold text-theme-primary mb-1">{cmd.name}</h3>
              <p className="themed-text mb-1">{cmd.description}</p>

              {cmd.permission && (
                <p className="themed-text mb-1">
                  <span className="text-white font-semibold">Required Permission:</span> {cmd.permission}
                </p>
              )}

              {cmd.options && cmd.options.length > 0 && (
                <>
                  <h4 className="text-white font-medium mt-2 mb-1">Options:</h4>
                  <ul className="list-disc ml-6 mb-2 themed-text">
                    {cmd.options.map(opt => (
                      <li key={opt.name}>
                        <span className="font-semibold">{opt.name}</span> — {opt.description}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {cmd.details && (
                <>
                  <h4 className="text-white font-medium mt-2 mb-1">Details:</h4>
                  <p className="themed-text ml-2">{cmd.details}</p>
                </>
              )}

              {cmd.example && (
                <p className="themed-text italic mt-2 text-sm">{cmd.example}</p>
              )}
            </div>
          ))}
        </div>

        <h2 className="themed-subtitle mb-3">Message Management</h2>
        <div id="purge" className="themed-card mb-6">
          <h3 className="text-xl font-bold text-theme-primary mb-2">{purgeCommand.name}</h3>
          <p className="themed-text mb-2">{purgeCommand.description}</p>
          <p className="themed-text mb-3"><span className="text-white font-semibold">Required Permission:</span> {purgeCommand.permission}</p>

          <h4 className="text-lg font-semibold text-white mb-2">Subcommands:</h4>
          <div className="space-y-4 ml-4">
            {purgeCommand.subcommands.map((sub) => (
              <div key={sub.name} className="border-l-2 border-theme-primary pl-4">
                <h5 className="text-lg font-semibold text-theme-primary mb-1">/purge {sub.name}</h5>
                <p className="themed-text mb-2">{sub.description}</p>

                <h6 className="text-white font-medium mb-1">Options:</h6>
                <ul className="list-disc ml-6 mb-2 themed-text">
                  {sub.options.map((opt) => (
                    <li key={opt.name}>
                      <span className="font-semibold">{opt.name}</span> — {opt.description}
                      {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                    </li>
                  ))}
                </ul>

                <p className="themed-text text-sm italic">{sub.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="themed-button-lg">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ChannelCommands;