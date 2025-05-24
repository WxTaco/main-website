import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CommandOption {
  name: string;
  description: string;
  required: boolean;
  choices?: string[];
  type?: string;
}

interface SubcommandGroup {
  name: string;
  description: string;
  subcommands: Subcommand[];
}

interface Subcommand {
  name: string;
  description: string;
  options?: CommandOption[];
  details?: string;
  examples?: string[];
}

interface Command {
  name: string;
  description: string;
  category: string;
  permission?: string;
  options?: CommandOption[];
  subcommands?: Subcommand[];
  subcommandGroups?: SubcommandGroup[];
  details?: string;
  examples?: string[];
  usage?: string;
  cooldown?: string;
}

const commands: Command[] = [
  // Utility Commands
  {
    name: '/ping',
    description: 'Check Wrapped v2\'s latency and response time.',
    category: 'Utility',
    details: 'Measures the time it takes for Wrapped v2 to respond to your command (message latency) and the Discord API response time (API latency). Useful for diagnosing connection issues.',
    usage: 'Simply run the command with no parameters',
    examples: ['/ping'],
    cooldown: 'None'
  },
  {
    name: '/afk',
    description: 'Set your AFK (Away From Keyboard) status with an optional reason.',
    category: 'Utility',
    options: [
      { name: 'reason', description: 'Reason for going AFK (optional)', required: false, type: 'string' }
    ],
    details: 'Sets your AFK status which will be displayed when someone mentions you. Wrapped v2 automatically removes your AFK status when you send your next message and shows how long you were away. Perfect for letting others know you\'re temporarily unavailable.',
    usage: 'Use with or without a reason. Wrapped v2 will track your AFK time automatically.',
    examples: ['/afk', '/afk reason:Taking a lunch break', '/afk reason:In a meeting'],
    cooldown: '5 seconds'
  },
  {
    name: '/define',
    description: 'Get comprehensive dictionary definitions for any word.',
    category: 'Utility',
    options: [
      { name: 'word', description: 'The word to look up in the dictionary', required: true, type: 'string' }
    ],
    details: 'Fetches detailed word definitions, pronunciations, phonetics, parts of speech, and usage examples from a comprehensive dictionary API. Supports multiple definitions and word forms.',
    usage: 'Provide any English word to get its complete definition',
    examples: ['/define word:serendipity', '/define word:ephemeral', '/define word:ubiquitous'],
    cooldown: '3 seconds'
  },
  {
    name: '/gemini',
    description: 'Interact with Google\'s advanced Gemini AI for text generation.',
    category: 'AI & Generation',
    subcommands: [
      {
        name: 'text',
        description: 'Generate text responses using Gemini AI',
        options: [
          { name: 'prompt', description: 'Your text prompt for Gemini', required: true, type: 'string' },
          { name: 'tokens', description: 'Maximum tokens to generate (1-2048, default: 500)', required: false, type: 'integer' }
        ],
        details: 'Uses Google\'s Gemini AI model to generate intelligent, contextual responses to your prompts. Supports creative writing, explanations, analysis, and more.',
        examples: ['/gemini text prompt:Explain quantum physics simply', '/gemini text prompt:Write a short story about space tokens:1000']
      }
    ],
    details: 'Powered by Google\'s state-of-the-art Gemini AI model for intelligent conversations, creative writing, explanations, and assistance with various tasks.',
    usage: 'Use the text subcommand with your prompt. Optionally specify token limit for longer responses.',
    examples: ['/gemini text prompt:Explain machine learning', '/gemini text prompt:Write a poem about coding'],
    cooldown: '10 seconds'
  },
  {
    name: '/mystats',
    description: 'View your comprehensive server activity statistics and engagement metrics.',
    category: 'Utility',
    details: 'Displays detailed statistics about your activity in the current server, including message count, command usage, activity patterns, and engagement metrics. Helps you track your participation and involvement in the community.',
    usage: 'Run without parameters to see your stats for the current server',
    examples: ['/mystats'],
    cooldown: '10 seconds'
  },
  {
    name: '/remind',
    description: 'Set personal reminders with custom messages and timing.',
    category: 'Utility',
    options: [
      { name: 'time', description: 'When to remind you (e.g., 1h, 30m, 2d, 1w)', required: true, type: 'string' },
      { name: 'message', description: 'What to remind you about', required: true, type: 'string' }
    ],
    details: 'Creates a personal reminder that Wrapped v2 will send you via DM at the specified time. Supports various time formats including minutes (m), hours (h), days (d), and weeks (w). Perfect for important tasks, meetings, or deadlines.',
    usage: 'Specify a time duration and reminder message. Wrapped v2 will DM you when the time is up.',
    examples: ['/remind time:1h message:Check the oven', '/remind time:30m message:Meeting with team', '/remind time:2d message:Submit project proposal'],
    cooldown: '5 seconds'
  },


  // Server Information Commands
  {
    name: '/server',
    description: 'Comprehensive server information and management tools.',
    category: 'Server Information',
    subcommands: [
      {
        name: 'overview',
        description: 'Get general information about the server',
        details: 'Displays comprehensive server information including name, ID, owner, member count, roles, channels, creation date, boost level, and boost count. Perfect for getting a quick overview of server statistics.',
        examples: ['/server overview']
      },
      {
        name: 'owner',
        description: 'View detailed information about the server owner',
        details: 'Shows the server owner\'s username, ID, when they joined the server, and when their account was created. Includes their avatar and profile information.',
        examples: ['/server owner']
      },
      {
        name: 'roles',
        description: 'List all server roles with pagination',
        details: 'Displays all server roles (excluding @everyone) sorted by position. Uses pagination for servers with many roles and includes interactive navigation with reaction buttons.',
        examples: ['/server roles']
      },
      {
        name: 'invites',
        description: 'View all server invites with detailed information',
        details: 'Shows all active server invites including invite codes, who created them, creation dates, expiration dates, and usage statistics. Paginated for easy browsing.',
        examples: ['/server invites']
      },
      {
        name: 'boosts',
        description: 'Display server boost information and boosters',
        details: 'Shows the server\'s boost level, total boost count, and a list of all members who are currently boosting the server. Includes pagination for servers with many boosters.',
        examples: ['/server boosts']
      },
      {
        name: 'avatar',
        description: 'Get the server\'s icon/avatar in high resolution',
        details: 'Displays the server\'s icon in the highest available resolution (up to 4096px). Shows a message if the server doesn\'t have a custom icon.',
        examples: ['/server avatar']
      },
      {
        name: 'banner',
        description: 'Get the server\'s banner image',
        details: 'Displays the server\'s banner image in high resolution if one is set. Only available for servers that have uploaded a custom banner.',
        examples: ['/server banner']
      },
      {
        name: 'splash',
        description: 'Get the server\'s splash screen image',
        details: 'Shows the server\'s splash screen image used for invite links. Only available for servers that have set a custom splash image.',
        examples: ['/server splash']
      }
    ],
    details: 'A comprehensive command suite for viewing detailed server information. All subcommands provide rich embed displays with relevant server data, images, and statistics. Most subcommands include pagination for large datasets.',
    usage: 'Use any of the subcommands to get specific server information. All commands work in the current server context.',
    examples: ['/server overview', '/server roles', '/server boosts'],
    cooldown: '5 seconds'
  },

  // Channel Management Commands
  {
    name: '/channel',
    description: 'Comprehensive channel management and information system.',
    category: 'Channel Management',
    subcommandGroups: [
      {
        name: 'info',
        description: 'View detailed channel information and analytics',
        subcommands: [
          {
            name: 'overview',
            description: 'Get comprehensive channel information with interactive menu',
            options: [
              { name: 'channel', description: 'Target channel (defaults to current)', required: false, type: 'channel' }
            ],
            details: 'Displays detailed channel information including ID, type, NSFW status, creation date, position, topic, slowmode, parent category, permissions, settings, and members (for voice channels). Features an interactive menu to switch between different information sections.',
            examples: ['/channel info overview', '/channel info overview channel:#general']
          },
          {
            name: 'threads',
            description: 'List all active threads in a channel',
            options: [
              { name: 'channel', description: 'Target channel (defaults to current)', required: false, type: 'channel' }
            ],
            details: 'Shows all active threads in the specified channel with creation dates and pagination for easy browsing.',
            examples: ['/channel info threads', '/channel info threads channel:#general']
          },
          {
            name: 'pins',
            description: 'List all pinned messages in a channel',
            options: [
              { name: 'channel', description: 'Target channel (defaults to current)', required: false, type: 'channel' }
            ],
            details: 'Displays all pinned messages with author information and message previews. Includes pagination for channels with many pinned messages.',
            examples: ['/channel info pins', '/channel info pins channel:#announcements']
          },
          {
            name: 'webhooks',
            description: 'View all webhooks configured for a channel',
            options: [
              { name: 'channel', description: 'Target channel (defaults to current)', required: false, type: 'channel' }
            ],
            details: 'Lists all webhooks in the channel including their names and creators. Useful for managing integrations and bots.',
            examples: ['/channel info webhooks', '/channel info webhooks channel:#general']
          },
          {
            name: 'watch',
            description: 'Live preview of the latest message with refresh capability',
            options: [
              { name: 'channel', description: 'Target channel (defaults to current)', required: false, type: 'channel' }
            ],
            details: 'Shows the most recent message in the channel with a refresh button to update in real-time. Perfect for monitoring channel activity.',
            examples: ['/channel info watch', '/channel info watch channel:#general']
          }
        ]
      }
    ],
    details: 'A powerful channel management system with detailed information displays, interactive menus, and real-time monitoring capabilities. All commands support both current and specified channels, with rich embed displays and pagination where needed.',
    usage: 'Use the info subcommand group to access various channel information tools. Most commands work on the current channel by default.',
    examples: ['/channel info overview', '/channel info threads', '/channel info watch'],
    cooldown: '3 seconds'
  },

  // Moderation Commands
  {
    name: '/ban',
    description: 'Permanently ban a user from the server.',
    category: 'Moderation',
    permission: 'Ban Members',
    options: [
      { name: 'user', description: 'User to ban from the server', required: true, type: 'user' },
      { name: 'reason', description: 'Reason for the ban (optional)', required: false, type: 'string' }
    ],
    details: 'Permanently removes a user from the server and prevents them from rejoining until they are unbanned. The ban reason is logged and can be viewed in the server\'s audit log. Banned users cannot rejoin even with a new invite.',
    usage: 'Specify the user to ban and optionally provide a reason for moderation logs.',
    examples: ['/ban user:@BadUser reason:Spamming', '/ban user:@Troublemaker reason:Harassment'],
    cooldown: '5 seconds'
  },
  {
    name: '/kick',
    description: 'Remove a user from the server.',
    category: 'Moderation',
    permission: 'Kick Members',
    options: [
      { name: 'user', description: 'User to kick', required: true, type: 'user' },
      { name: 'reason', description: 'Reason for kick', required: false, type: 'string' }
    ],
    details: 'Removes a user from the server. They can rejoin with a new invite.',
    examples: ['/kick user:@TroubleMaker reason:Breaking rules']
  },
  {
    name: '/mute',
    description: 'Temporarily mute a user.',
    category: 'Moderation',
    permission: 'Moderate Members',
    options: [
      { name: 'user', description: 'User to mute', required: true, type: 'user' },
      { name: 'duration', description: 'How long to mute (e.g., 10m, 1h, 1d)', required: true, type: 'string' },
      { name: 'reason', description: 'Reason for mute', required: false, type: 'string' }
    ],
    details: 'Prevents a user from sending messages for the specified duration.',
    examples: ['/mute user:@SpamBot duration:1h reason:Excessive posting']
  },
  {
    name: '/unban',
    description: 'Unban a previously banned user.',
    category: 'Moderation',
    permission: 'Ban Members',
    options: [
      { name: 'user_id', description: 'ID of the user to unban', required: true, type: 'string' },
      { name: 'reason', description: 'Reason for unban', required: false, type: 'string' }
    ],
    details: 'Removes a ban from a user, allowing them to rejoin the server.',
    examples: ['/unban user_id:123456789012345678 reason:Appeal accepted']
  },

  // Channel Management
  {
    name: '/lock',
    description: 'Lock the current channel to prevent users from sending messages.',
    category: 'Channel Management',
    permission: 'Manage Channels',
    options: [
      { name: 'reason', description: 'Reason for locking the channel', required: false, type: 'string' }
    ],
    details: 'Modifies channel permissions to prevent the @everyone role from sending messages.',
    examples: ['/lock', '/lock reason:Raid protection']
  },
  {
    name: '/unlock',
    description: 'Unlock a previously locked channel.',
    category: 'Channel Management',
    permission: 'Manage Channels',
    options: [
      { name: 'reason', description: 'Reason for unlocking the channel', required: false, type: 'string' }
    ],
    details: 'Restores normal channel permissions for the @everyone role.',
    examples: ['/unlock', '/unlock reason:Situation resolved']
  },
  {
    name: '/slowmode',
    description: 'Set slowmode for the current channel.',
    category: 'Channel Management',
    permission: 'Manage Channels',
    options: [
      { name: 'duration', description: 'Slowmode duration in seconds (0 to disable)', required: true, type: 'integer' },
      { name: 'reason', description: 'Reason for setting slowmode', required: false, type: 'string' }
    ],
    details: 'Limits how frequently users can send messages in the channel.',
    examples: ['/slowmode duration:5 reason:Reduce spam', '/slowmode duration:0']
  },
  {
    name: '/purge',
    description: 'Delete messages from the channel.',
    category: 'Channel Management',
    permission: 'Manage Messages',
    subcommands: [
      {
        name: 'messages',
        description: 'Delete a number of messages in this channel.',
        options: [
          { name: 'amount', description: 'Number of messages to delete (1-100)', required: true },
          { name: 'user', description: 'Only delete messages from this user', required: false }
        ]
      }
    ],
    details: 'Bulk deletes messages. Messages older than 2 weeks will be deleted individually.',
    examples: ['/purge messages amount:10', '/purge messages amount:50 user:@SpamBot']
  },

  // User Information
  {
    name: '/user',
    description: 'Get information about users.',
    category: 'User Information',
    subcommands: [
      {
        name: 'info',
        description: 'Get detailed information about a user.',
        options: [
          { name: 'target', description: 'User to get info about (defaults to yourself)', required: false }
        ],
        details: 'Shows username, ID, join date, account creation, roles, and status.'
      },
      {
        name: 'avatar',
        description: 'Get a user\'s avatar.',
        options: [
          { name: 'target', description: 'User to get avatar of', required: false },
          { name: 'type', description: 'Avatar type', required: false, choices: ['Public', 'Server'] }
        ],
        details: 'Displays user avatar in high resolution. Can show public or server-specific avatar.'
      },
      {
        name: 'banner',
        description: 'Get a user\'s banner.',
        options: [
          { name: 'target', description: 'User to get banner of', required: false },
          { name: 'type', description: 'Banner type', required: false, choices: ['Public', 'Server'] }
        ],
        details: 'Shows user banner if they have one set. Can display public or server-specific banner.'
      }
    ],
    examples: ['/user info', '/user avatar target:@Friend', '/user banner type:Server']
  },

  // Fun Commands
  {
    name: '/fun',
    description: 'Fun commands to lighten the mood!',
    category: 'Fun',
    subcommands: [
      {
        name: 'joke',
        description: 'Get a random joke.',
        options: [
          { name: 'category', description: 'Joke category', required: false, choices: ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas'] }
        ],
        details: 'Fetches jokes from JokeAPI. Can be single-line or setup/delivery format.'
      },
      {
        name: 'meme',
        description: 'Get a random meme.',
        options: [
          { name: 'subreddit', description: 'Subreddit to fetch from (default: memes)', required: false }
        ],
        details: 'Fetches random meme images from Reddit with post info.'
      },
      {
        name: '8ball',
        description: 'Ask the magic 8-ball a question.',
        options: [
          { name: 'question', description: 'Your yes/no question', required: true }
        ],
        details: 'Classic Magic 8-Ball with 20 possible answers.'
      }
    ],
    examples: ['/fun joke category:Programming', '/fun meme subreddit:dankmemes', '/fun 8ball question:Will it rain today?']
  },

  // Ticket System
  {
    name: '/ticket',
    description: 'Create and manage ticket panels.',
    category: 'Tickets',
    permission: 'Manage Server',
    subcommands: [
      {
        name: 'panel',
        description: 'Create a simple ticket panel.',
        options: [
          { name: 'channel', description: 'Channel to send panel to', required: true },
          { name: 'title', description: 'Panel title', required: true },
          { name: 'description', description: 'Panel description', required: true },
          { name: 'support_role', description: 'Role to ping when tickets are created', required: false },
          { name: 'ping_support', description: 'Whether to ping support role', required: false }
        ],
        details: 'Creates a ticket panel with a button users can click to open tickets.'
      }
    ],
    details: 'Advanced ticket system with configuration management and custom panels.',
    examples: ['/ticket panel channel:#support title:Get Help description:Click to open a support ticket']
  },

  // Custom Embed Builder
  {
    name: '/embed',
    description: 'Create and manage custom embed messages.',
    category: 'Custom Tools',
    permission: 'Manage Messages',
    subcommands: [
      {
        name: 'create',
        description: 'Create a new embed.',
        options: [
          { name: 'name', description: 'Unique name for this embed', required: true },
          { name: 'title', description: 'Embed title', required: false },
          { name: 'description', description: 'Embed description', required: false },
          { name: 'color', description: 'Color in HEX format', required: false },
          { name: 'footer', description: 'Footer text', required: false },
          { name: 'timestamp', description: 'Include timestamp', required: false },
          { name: 'image', description: 'Image URL', required: false },
          { name: 'thumbnail', description: 'Thumbnail URL', required: false }
        ]
      },
      {
        name: 'send',
        description: 'Send a saved embed publicly.',
        options: [
          { name: 'name', description: 'Name of embed to send', required: true }
        ]
      },
      {
        name: 'view',
        description: 'View all saved embeds.'
      },
      {
        name: 'delete',
        description: 'Delete a saved embed.',
        options: [
          { name: 'name', description: 'Name of embed to delete', required: true }
        ]
      }
    ],
    details: 'Create rich embed messages with placeholders like {user}, {guild}, {channel}.',
    examples: ['/embed create name:welcome title:Welcome! description:Welcome to {guild}!', '/embed send name:welcome']
  },

  // Role Management
  {
    name: '/role',
    description: 'Manage user roles.',
    category: 'Role Management',
    permission: 'Manage Roles',
    subcommands: [
      {
        name: 'add',
        description: 'Add a role to a user.',
        options: [
          { name: 'user', description: 'User to add role to', required: true },
          { name: 'role', description: 'Role to add', required: true },
          { name: 'reason', description: 'Reason for adding role', required: false }
        ]
      },
      {
        name: 'remove',
        description: 'Remove a role from a user.',
        options: [
          { name: 'user', description: 'User to remove role from', required: true },
          { name: 'role', description: 'Role to remove', required: true },
          { name: 'reason', description: 'Reason for removing role', required: false }
        ]
      }
    ],
    details: 'Add or remove roles from users with optional reason logging.',
    examples: ['/role add user:@Member role:@VIP reason:Promotion', '/role remove user:@Member role:@Muted']
  },

  // Nickname Management
  {
    name: '/nickname',
    description: 'Change user nicknames.',
    category: 'User Management',
    permission: 'Manage Nicknames',
    options: [
      { name: 'user', description: 'User to change nickname for', required: true, type: 'user' },
      { name: 'nickname', description: 'New nickname (leave empty to reset)', required: false, type: 'string' },
      { name: 'reason', description: 'Reason for nickname change', required: false, type: 'string' }
    ],
    details: 'Change or reset user nicknames in the server.',
    examples: ['/nickname user:@Member nickname:NewName reason:Requested change', '/nickname user:@Member reason:Reset nickname']
  },

  // Transcript System
  {
    name: '/transcript',
    description: 'Generate channel transcripts.',
    category: 'Utility',
    permission: 'Manage Messages',
    options: [
      { name: 'channel', description: 'Channel to create transcript for', required: false, type: 'channel' },
      { name: 'limit', description: 'Number of messages to include (default: 100)', required: false, type: 'integer' }
    ],
    details: 'Creates a downloadable HTML transcript of channel messages.',
    examples: ['/transcript', '/transcript channel:#general limit:500']
  },

  // Debug Commands
  {
    name: '/debug',
    description: 'Debug and testing commands.',
    category: 'Debug',
    permission: 'Administrator',
    subcommands: [
      {
        name: 'ping',
        description: 'Advanced ping with detailed latency info.'
      },
      {
        name: 'info',
        description: 'Show Wrapped v2 system information.'
      }
    ],
    details: 'Administrative commands for debugging and system information.',
    examples: ['/debug ping', '/debug info']
  },

  // Image Generation
  {
    name: '/singlecolorimage',
    description: 'Generate a single color image.',
    category: 'Image Tools',
    options: [
      { name: 'color', description: 'Color in HEX format (e.g., #ff0000)', required: true, type: 'string' },
      { name: 'width', description: 'Image width in pixels (default: 100)', required: false, type: 'integer' },
      { name: 'height', description: 'Image height in pixels (default: 100)', required: false, type: 'integer' }
    ],
    details: 'Creates a solid color image with specified dimensions.',
    examples: ['/singlecolorimage color:#ff0000', '/singlecolorimage color:#00ff00 width:200 height:150']
  },

  // Tags System
  {
    name: '/tag',
    description: 'Manage server tags/autoresponders.',
    category: 'Custom Tools',
    permission: 'Manage Messages',
    subcommands: [
      {
        name: 'create',
        description: 'Create a new tag.',
        options: [
          { name: 'name', description: 'Tag name/trigger', required: true },
          { name: 'content', description: 'Tag response content', required: true }
        ]
      },
      {
        name: 'delete',
        description: 'Delete a tag.',
        options: [
          { name: 'name', description: 'Tag name to delete', required: true }
        ]
      },
      {
        name: 'list',
        description: 'List all server tags.'
      }
    ],
    details: 'Create custom commands that respond with predefined messages.',
    examples: ['/tag create name:rules content:Please follow our server rules!', '/tag list']
  }
];

const BotDocs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [expandedSubcommand, setExpandedSubcommand] = useState<string | null>(null);
  const [expandedSubcommandGroup, setExpandedSubcommandGroup] = useState<string | null>(null);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bot-docs-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = ['All', ...Array.from(new Set(commands.map(cmd => cmd.category)))];

  const filteredCommands = useMemo(() => {
    let filtered = commands.filter(cmd => {
      const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cmd.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (cmd.details && cmd.details.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Show favorites first if no search/filter, otherwise sort alphabetically
    if (searchTerm === '' && selectedCategory === 'All' && favorites.length > 0) {
      const favoriteCommands = filtered.filter(cmd => favorites.includes(cmd.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      const otherCommands = filtered.filter(cmd => !favorites.includes(cmd.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      filtered = [...favoriteCommands, ...otherCommands];
    } else {
      // Sort alphabetically by command name
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchTerm, selectedCategory, favorites]);

  // Helper functions
  const toggleFavorite = (commandName: string) => {
    const newFavorites = favorites.includes(commandName)
      ? favorites.filter(name => name !== commandName)
      : [...favorites, commandName];
    setFavorites(newFavorites);
    localStorage.setItem('bot-docs-favorites', JSON.stringify(newFavorites));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
          e.preventDefault();
          document.getElementById('search')?.focus();
        }
      }
      if (e.key === 'Escape') {
        setSearchTerm('');
        setSelectedCategory('All');
        setExpandedCommand(null);
        setExpandedSubcommand(null);
        setExpandedSubcommandGroup(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Component for rendering subcommand groups
  const SubcommandGroupCard = ({ group, commandName }: { group: SubcommandGroup; commandName: string }) => {
    const groupKey = `${commandName}-${group.name}`;
    const isExpanded = expandedSubcommandGroup === groupKey;

    return (
      <div className="mb-4">
        <button
          onClick={() => setExpandedSubcommandGroup(isExpanded ? null : groupKey)}
          className="w-full text-left p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-semibold text-blue-400 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {group.name}
              </h5>
              <p className="text-sm text-white/70 mt-1">{group.description}</p>
            </div>
            <svg
              className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3 pl-4 border-l-2 border-blue-500/20">
            {group.subcommands.map((subcommand) => (
              <SubcommandCard key={subcommand.name} subcommand={subcommand} commandName={commandName} groupName={group.name} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Component for rendering individual subcommands
  const SubcommandCard = ({ subcommand, commandName, groupName }: { subcommand: Subcommand; commandName: string; groupName?: string }) => {
    const subKey = `${commandName}-${groupName || 'direct'}-${subcommand.name}`;
    const isExpanded = expandedSubcommand === subKey;

    return (
      <div className="bg-black/20 rounded-lg border border-theme-border/20">
        <button
          onClick={() => setExpandedSubcommand(isExpanded ? null : subKey)}
          className="w-full text-left p-3 hover:bg-black/30 transition-colors duration-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h6 className="font-medium text-theme-primary flex items-center">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {subcommand.name}
              </h6>
              <p className="text-sm text-white/70 mt-1">{subcommand.description}</p>
            </div>
            <svg
              className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 space-y-3 border-t border-theme-border/10 mt-3 pt-3">
            {subcommand.details && (
              <div className="p-2 bg-black/20 rounded text-sm text-white/80">
                {subcommand.details}
              </div>
            )}

            {subcommand.options && subcommand.options.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Options:</div>
                <div className="mt-2 space-y-1">
                  {subcommand.options.map((option) => (
                    <div key={option.name} className="text-sm bg-black/10 p-2 rounded">
                      <span className="font-medium text-theme-primary">{option.name}</span>
                      {option.required && <span className="text-wrapped-yellow ml-1">*</span>}
                      <span className="text-white/70"> — {option.description}</span>
                      {option.choices && (
                        <div className="mt-1 text-xs text-white/60">
                          Choices: {option.choices.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subcommand.examples && subcommand.examples.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Examples:</div>
                <div className="mt-2 space-y-1">
                  {subcommand.examples.map((example, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/30 px-2 py-1 rounded">
                      <code className="text-xs text-theme-primary">{example}</code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(example);
                        }}
                        className="text-white/50 hover:text-white transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-8 px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-theme-primary/20 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="themed-title mb-0">Wrapped v2 Documentation</h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-6">
              Complete guide to all Wrapped v2 commands and features. Use <kbd className="px-2 py-1 bg-black/30 rounded text-sm">Ctrl+K</kbd> to search quickly.
            </p>
          </div>
        </div>

          {/* Quick Stats Container */}
          <div className="themed-card max-w-5xl mx-auto mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Wrapped v2 Overview</h2>
              <p className="text-sm text-white/70">Comprehensive statistics about Wrapped v2's capabilities</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-theme-primary/20 to-theme-primary/10 rounded-lg p-4 border border-theme-primary/30 text-center">
                <div className="text-2xl font-bold text-theme-primary">{commands.length}</div>
                <div className="text-xs text-white/70 mt-1">Total Commands</div>
              </div>
              <div className="bg-gradient-to-br from-wrapped-blue/20 to-wrapped-blue/10 rounded-lg p-4 border border-wrapped-blue/30 text-center">
                <div className="text-2xl font-bold text-wrapped-blue">{categories.length - 1}</div>
                <div className="text-xs text-white/70 mt-1">Categories</div>
              </div>
              <div className="bg-gradient-to-br from-wrapped-yellow/20 to-wrapped-yellow/10 rounded-lg p-4 border border-wrapped-yellow/30 text-center">
                <div className="text-2xl font-bold text-wrapped-yellow">{commands.filter(cmd => cmd.permission).length}</div>
                <div className="text-xs text-white/70 mt-1">Admin Commands</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                <div className="text-2xl font-bold text-green-400">{commands.filter(cmd => cmd.subcommands && cmd.subcommands.length > 0).length}</div>
                <div className="text-xs text-white/70 mt-1">Multi-Command</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-lg p-4 border border-purple-500/30 text-center">
                <div className="text-2xl font-bold text-purple-400">{commands.filter(cmd => cmd.category === 'Fun').length}</div>
                <div className="text-xs text-white/70 mt-1">Fun Commands</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-lg p-4 border border-red-500/30 text-center">
                <div className="text-2xl font-bold text-red-400">{commands.filter(cmd => cmd.category === 'Moderation').length}</div>
                <div className="text-xs text-white/70 mt-1">Moderation</div>
              </div>
            </div>

            {/* Additional Info Row */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-theme-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Quick Response</span>
                </div>
                <p className="text-xs text-white/70">Lightning-fast command execution with minimal latency</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-theme-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Secure & Reliable</span>
                </div>
                <p className="text-xs text-white/70">Built with security best practices and 99.9% uptime</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30 text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-theme-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Community Driven</span>
                </div>
                <p className="text-xs text-white/70">Regular updates based on user feedback and requests</p>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="mt-6 pt-6 border-t border-theme-border/20">
              <h3 className="text-sm font-semibold text-white mb-3 text-center">Most Popular Categories</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(1).map(category => {
                  const count = commands.filter(cmd => cmd.category === category).length;
                  const isPopular = count >= 3;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        isPopular
                          ? 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30 hover:bg-theme-primary/30'
                          : 'bg-gray-800/40 text-white/70 border border-gray-600/30 hover:bg-gray-700/50'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        {/* Favorites Commands Sidebar */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <div className="themed-card max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-theme-primary mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Favorite Commands
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {favorites.slice(0, 6).map(commandName => {
                  const command = commands.find(cmd => cmd.name === commandName);
                  if (!command) return null;
                  return (
                    <button
                      key={commandName}
                      onClick={() => setSearchTerm(commandName)}
                      className="w-full text-left p-2 bg-gray-800/40 rounded border border-gray-600/30 hover:border-theme-primary/50 transition-colors duration-200"
                    >
                      <div className="font-medium text-theme-primary text-sm">{command.name}</div>
                      <div className="text-xs text-white/70 truncate">{command.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Start Guide */}
        <div className="themed-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Start Guide
            </h3>
            <button
              onClick={() => setShowQuickStart(!showQuickStart)}
              className="text-theme-primary hover:text-theme-primary/80 transition-colors duration-200"
            >
              {showQuickStart ? 'Hide' : 'Show'}
            </button>
          </div>

          {showQuickStart && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="font-semibold text-theme-primary mb-2">First Steps</h4>
                  <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
                    <li>Invite Wrapped v2 to your server</li>
                    <li>Set up permissions for admin commands</li>
                    <li>Try <code className="bg-gray-700/50 px-1 rounded">/ping</code> to test connectivity</li>
                    <li>Explore <code className="bg-gray-700/50 px-1 rounded">/server overview</code> for server info</li>
                  </ol>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="font-semibold text-wrapped-blue mb-2">Essential Setup</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>Create ticket panels with <code className="bg-gray-700/50 px-1 rounded">/ticket panel</code></li>
                    <li>Set up custom embeds with <code className="bg-gray-700/50 px-1 rounded">/embed create</code></li>
                    <li>Configure moderation tools for your server</li>
                    <li>Test fun commands to engage your community</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gradient-to-r from-theme-primary/10 to-wrapped-blue/10 rounded-lg p-4 border border-theme-primary/20">
                <p className="text-sm text-white/80">
                  <strong>Pro Tip:</strong> Use the favorites feature to bookmark commands you use frequently.
                  Click the heart icon next to any command to add it to your favorites for quick access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="themed-card mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-white mb-2">
                Search Commands
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search commands, descriptions, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/40 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="md:w-48">
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-32">
                <label className="block text-sm font-medium text-white mb-2">
                  View
                </label>
                <div className="flex bg-gray-800/50 rounded-lg border border-gray-600/40 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-theme-primary text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-theme-primary text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">
              Showing {filteredCommands.length} of {commands.length} commands
            </span>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-theme-primary hover:text-theme-primary/80 font-medium transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Getting Started Section */}
        {searchTerm === '' && selectedCategory === 'All' && (
          <div className="themed-card mb-8">
            <h2 className="text-2xl font-bold text-theme-primary mb-4">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Basic Commands</h3>
                <p className="themed-text mb-3">Start with these essential commands:</p>
                <ul className="space-y-1 themed-text text-sm">
                  <li><code className="bg-black/30 px-1 rounded">/ping</code> - Check Wrapped v2 status and latency</li>
                  <li><code className="bg-black/30 px-1 rounded">/server overview</code> - View server information</li>
                  <li><code className="bg-black/30 px-1 rounded">/user info</code> - See your profile details</li>
                  <li><code className="bg-black/30 px-1 rounded">/fun joke</code> - Get a random joke</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Admin Features</h3>
                <p className="themed-text mb-3">Powerful moderation and management tools:</p>
                <ul className="space-y-1 themed-text text-sm">
                  <li><code className="bg-black/30 px-1 rounded">/ticket panel</code> - Create support ticket system</li>
                  <li><code className="bg-black/30 px-1 rounded">/embed create</code> - Design rich messages</li>
                  <li><code className="bg-black/30 px-1 rounded">/purge messages</code> - Clean up channels</li>
                  <li><code className="bg-black/30 px-1 rounded">/role add</code> - Manage user roles</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-theme-primary/10 rounded border border-theme-primary/20">
              <p className="text-sm themed-text">
                <strong>Note:</strong> Commands marked with a permission requirement can only be used by users with the specified Discord permission.
              </p>
            </div>
          </div>
        )}

        {/* Commands Display */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCommands.map((command) => (
              <div key={command.name} className="themed-card hover:border-theme-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-theme-primary/10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-theme-primary break-all">{command.name}</h3>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => toggleFavorite(command.name)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        favorites.includes(command.name)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-white/50 hover:text-red-400'
                      }`}
                      title={favorites.includes(command.name) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg className="w-4 h-4" fill={favorites.includes(command.name) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <span className="px-2 py-1 text-xs bg-theme-primary/20 text-theme-primary rounded-full whitespace-nowrap">
                      {command.category}
                    </span>
                  </div>
                </div>

                <p className="themed-text mb-4">{command.description}</p>

                {command.permission && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-wrapped-yellow bg-wrapped-yellow/20 px-2 py-1 rounded">
                      Requires: {command.permission}
                    </span>
                  </div>
                )}

                {command.details && (
                  <div className="mb-4 p-3 bg-black/20 rounded border border-theme-border/20">
                    <p className="text-sm themed-text">{command.details}</p>
                  </div>
                )}

                {command.options && command.options.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Options:</h4>
                    <ul className="space-y-1">
                      {command.options.map((option) => (
                        <li key={option.name} className="text-sm themed-text">
                          <span className="font-medium text-theme-primary">{option.name}</span>
                          {option.required && <span className="text-wrapped-yellow"> *</span>}
                          <span className="text-white/70"> — {option.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {command.subcommandGroups && command.subcommandGroups.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-3">Subcommand Groups:</h4>
                    <div className="space-y-2">
                      {command.subcommandGroups.map((group) => (
                        <SubcommandGroupCard key={group.name} group={group} commandName={command.name} />
                      ))}
                    </div>
                  </div>
                )}

                {command.subcommands && command.subcommands.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-3">Subcommands:</h4>
                    <div className="space-y-2">
                      {command.subcommands.map((sub) => (
                        <SubcommandCard key={sub.name} subcommand={sub} commandName={command.name} />
                      ))}
                    </div>
                  </div>
                )}

                {command.examples && command.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Examples:</h4>
                    <div className="space-y-1">
                      {command.examples.map((example, index) => (
                        <code key={index} className="block text-xs bg-black/30 px-2 py-1 rounded text-theme-primary">
                          {example}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommands.map((command) => (
              <div key={command.name} className="themed-card hover:border-theme-primary/50 transition-all duration-300">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedCommand(expandedCommand === command.name ? null : command.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-bold text-theme-primary">{command.name}</h3>
                      <span className="px-2 py-1 text-xs bg-theme-primary/20 text-theme-primary rounded-full">
                        {command.category}
                      </span>
                      {command.permission && (
                        <span className="text-xs font-medium text-wrapped-yellow bg-wrapped-yellow/20 px-2 py-1 rounded">
                          {command.permission}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(command.name);
                        }}
                        className={`p-1 rounded transition-colors duration-200 ${
                          favorites.includes(command.name)
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-white/50 hover:text-red-400'
                        }`}
                        title={favorites.includes(command.name) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg className="w-4 h-4" fill={favorites.includes(command.name) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <svg
                        className={`w-5 h-5 text-white/50 transition-transform duration-200 ${
                          expandedCommand === command.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="themed-text mt-2">{command.description}</p>
                </div>

                {expandedCommand === command.name && (
                  <div className="mt-4 pt-4 border-t border-theme-border/20 space-y-4">
                    {command.details && (
                      <div className="p-3 bg-black/20 rounded border border-theme-border/20">
                        <p className="text-sm themed-text">{command.details}</p>
                      </div>
                    )}

                    {command.options && command.options.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Options:</h4>
                        <ul className="space-y-2">
                          {command.options.map((option) => (
                            <li key={option.name} className="text-sm themed-text bg-black/10 p-2 rounded">
                              <span className="font-medium text-theme-primary">{option.name}</span>
                              {option.required && <span className="text-wrapped-yellow"> *</span>}
                              <span className="text-white/70"> — {option.description}</span>
                              {option.choices && (
                                <div className="mt-1 text-xs text-white/60">
                                  Choices: {option.choices.join(', ')}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {command.subcommandGroups && command.subcommandGroups.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Subcommand Groups:</h4>
                        <div className="space-y-3">
                          {command.subcommandGroups.map((group) => (
                            <SubcommandGroupCard key={group.name} group={group} commandName={command.name} />
                          ))}
                        </div>
                      </div>
                    )}

                    {command.subcommands && command.subcommands.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Subcommands:</h4>
                        <div className="space-y-2">
                          {command.subcommands.map((sub) => (
                            <SubcommandCard key={sub.name} subcommand={sub} commandName={command.name} />
                          ))}
                        </div>
                      </div>
                    )}

                    {command.examples && command.examples.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Examples:</h4>
                        <div className="space-y-2">
                          {command.examples.map((example, index) => (
                            <div key={index} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded">
                              <code className="text-sm text-theme-primary">{example}</code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(example);
                                }}
                                className="text-white/50 hover:text-white transition-colors duration-200"
                                title="Copy to clipboard"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-theme-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No commands found</h3>
            <p className="themed-text">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Command Usage Tips */}
        <div className="themed-card mt-12">
          <h2 className="text-2xl font-bold text-theme-primary mb-6">Pro Tips & Best Practices</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="font-semibold text-blue-400 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Performance Tips
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Use <code className="bg-black/30 px-1 rounded">/purge</code> for bulk message deletion</li>
                <li>Set up <code className="bg-black/30 px-1 rounded">/slowmode</code> to prevent spam</li>
                <li>Create ticket panels once, use many times</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="font-semibold text-green-400 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Best Practices
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Review permissions before granting admin commands</li>
                <li>Use <code className="bg-black/30 px-1 rounded">/role</code> commands carefully</li>
                <li>Monitor moderation actions with reasons</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="font-semibold text-purple-400 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Community Engagement
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Use <code className="bg-black/30 px-1 rounded">/fun</code> commands to boost activity</li>
                <li>Create custom <code className="bg-black/30 px-1 rounded">/embed</code> messages</li>
                <li>Set up <code className="bg-black/30 px-1 rounded">/afk</code> for user convenience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="themed-card mt-8">
          <h2 className="text-xl font-bold text-theme-primary mb-4">Keyboard Shortcuts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                <span className="text-sm text-white/80">Focus search</span>
                <kbd className="px-2 py-1 bg-black/40 rounded text-xs text-white/70">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                <span className="text-sm text-white/80">Clear all filters</span>
                <kbd className="px-2 py-1 bg-black/40 rounded text-xs text-white/70">Escape</kbd>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                <span className="text-sm text-white/80">Toggle view mode</span>
                <span className="text-xs text-white/50">Click Grid/List buttons</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                <span className="text-sm text-white/80">Copy command example</span>
                <span className="text-xs text-white/50">Click copy icon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="themed-card mt-8">
          <h2 className="text-2xl font-bold text-theme-primary mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Invite Wrapped v2</h3>
              <p className="themed-text text-sm mb-3">Add Wrapped v2 to your Discord server to start using these commands.</p>
              <a
                href="https://discord.com/oauth2/authorize?client_id=1308803843446014052"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-theme-primary hover:bg-theme-primary/80 text-white px-4 py-2 rounded-md transition-colors duration-200 font-semibold text-sm"
              >
                Invite Wrapped v2
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Support</h3>
              <p className="themed-text text-sm mb-3">Need help? Join our support server for assistance and updates.</p>
              <a
                href="https://wrappedbot.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors duration-200 font-semibold text-sm"
              >
                Support Server
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">More Tools</h3>
              <p className="themed-text text-sm mb-3">Explore our collection of web development and Discord tools.</p>
              <Link
                to="/tools"
                className="inline-block bg-wrapped-blue hover:bg-wrapped-blue/80 text-white px-4 py-2 rounded-md transition-colors duration-200 font-semibold text-sm"
              >
                Browse Tools
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link to="/" className="themed-button-lg">
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

export default BotDocs;
