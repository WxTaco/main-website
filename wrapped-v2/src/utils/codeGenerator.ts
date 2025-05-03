import { Node, Edge as ReactFlowEdge } from 'reactflow';

interface GeneratedFiles {
  [key: string]: string;
}

// Function to generate bot files based on the flow
export const generateBotFiles = (nodes: Node[], edges: ReactFlowEdge[]): GeneratedFiles => {
  // This is a simplified implementation - in a real app, we would analyze the nodes and edges
  // to generate the appropriate files based on their connections and properties

  const indexJs = `const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(\`[WARNING] The command at \${filePath} is missing required "data" or "execute" property.\`);
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);`;

  const configJs = `module.exports = {
  token: 'YOUR_BOT_TOKEN_HERE',
  clientId: 'YOUR_CLIENT_ID_HERE',
  guildId: 'YOUR_GUILD_ID_HERE' // For development/testing
};`;

  const packageJson = `{
  "name": "discord-bot",
  "version": "1.0.0",
  "description": "A Discord bot created with Wrapped Bot Builder",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`;

  const readmeFile = `# Discord Bot

This Discord bot was created using the Wrapped Bot Builder.

## Setup

1. Install dependencies:
\`\`\`
npm install
\`\`\`

2. Edit the \`config.js\` file and add your bot token and client ID.

3. Run the bot:
\`\`\`
npm start
\`\`\`

## Commands

- \`/ping\`: Replies with "Pong!"

## Events

- \`ready\`: Logs when the bot is ready
- \`interactionCreate\`: Handles command interactions
`;

  // Generate command files based on command nodes
  const commandFiles: GeneratedFiles = {};
  const eventFiles: GeneratedFiles = {};

  // Add a default ping command
  commandFiles['commands/ping.js'] = `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};`;

  // Add default event handlers
  eventFiles['events/ready.js'] = `module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(\`Ready! Logged in as \${client.user.tag}\`);
  },
};`;

  eventFiles['events/interactionCreate.js'] = `module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(\`No command matching \${interaction.commandName} was found.\`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};`;

  // Process command nodes
  nodes.forEach(node => {
    if (node.type === 'command') {
      const commandName = node.data?.label?.toLowerCase().replace(/\s+/g, '-') || 'custom-command';
      commandFiles[`commands/${commandName}.js`] = `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${commandName}')
    .setDescription('${node.data?.description || 'A custom command'}'),

  async execute(interaction) {
    await interaction.reply('This is the ${node.data?.label || 'custom'} command!');
  },
};`;
    }

    if (node.type === 'messageCommand') {
      const commandName = node.data?.label?.toLowerCase().replace(/\s+/g, '-') || 'message-command';
      commandFiles[`commands/${commandName}.js`] = `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${commandName}')
    .setDescription('${node.data?.description || 'A message command'}'),

  async execute(interaction) {
    await interaction.reply('This is the ${node.data?.label || 'message'} command!');
  },
};`;
    }

    if (node.type?.includes('Event')) {
      const eventName = node.data?.label?.toLowerCase().replace(/\s+/g, '-') || 'custom-event';
      eventFiles[`events/${eventName}.js`] = `module.exports = {
  name: '${eventName.replace(/-event$/, '')}',
  once: false,
  execute(${node.type === 'messageEvent' ? 'message' : node.type === 'interactionEvent' ? 'interaction' : 'client'}) {
    console.log('${node.data?.label || 'Custom event'} triggered!');
  },
};`;
    }
  });

  return {
    'index.js': indexJs,
    'config.js': configJs,
    'package.json': packageJson,
    'README.md': readmeFile,
    ...commandFiles,
    ...eventFiles
  };
};

export default generateBotFiles;
