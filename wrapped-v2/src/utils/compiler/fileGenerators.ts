import type { Node, Edge, FlowAnalysis, GeneratedFiles } from './types';
import { generateCommandCode, generateEventCode } from './nodeHandlers';

/**
 * Generates the main index.js file
 */
export function generateIndexFile(): string {
  return `const { Client, GatewayIntentBits, Collection } = require('discord.js');
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
}

/**
 * Generates the config.js file
 */
export function generateConfigFile(): string {
  return `module.exports = {
  token: 'YOUR_BOT_TOKEN_HERE',
  clientId: 'YOUR_CLIENT_ID_HERE',
  guildId: 'YOUR_GUILD_ID_HERE' // For development/testing
};`;
}

/**
 * Generates the package.json file
 */
export function generatePackageFile(): string {
  return `{
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
    "axios": "^1.6.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`;
}

/**
 * Generates the README.md file
 */
export function generateReadmeFile(): string {
  return `# Discord Bot

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
}

/**
 * Generates the deploy-commands.js file
 */
export function generateDeployCommandsFile(): string {
  return `const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.js');
const fs = require('fs');
const path = require('path');

const commands = [];
// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(\`[WARNING] The command at \${filePath} is missing a required "data" property.\`);
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(\`Started refreshing \${commands.length} application (/) commands.\`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(\`Successfully reloaded \${data.length} application (/) commands.\`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();`;
}

/**
 * Generates a default ping command file
 */
export function generateDefaultPingCommand(): string {
  return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};`;
}

/**
 * Generates a default ready event file
 */
export function generateDefaultReadyEvent(): string {
  return `module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(\`Ready! Logged in as \${client.user.tag}\`);
  },
};`;
}

/**
 * Generates a default interaction event file
 */
export function generateDefaultInteractionEvent(): string {
  return `module.exports = {
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
}

/**
 * Generates command files based on command nodes
 */
export function generateCommandFiles(analysis: FlowAnalysis): GeneratedFiles {
  const commandFiles: GeneratedFiles = {};

  // Add a default ping command if no commands are defined
  if (analysis.commandNodes.length === 0) {
    commandFiles['commands/ping.js'] = generateDefaultPingCommand();
    return commandFiles;
  }

  // Generate a file for each command node
  for (const node of analysis.commandNodes) {
    const commandName = node.data?.commandName ||
                        node.data?.label?.toLowerCase().replace(/\s+/g, '-') ||
                        'custom-command';

    const context = {
      analysis,
      indent: '  ',
      currentIndentLevel: 0,
      variables: new Map<string, string>(),
      imports: new Set<string>(),
      usedNodeIds: new Set<string>()
    };

    const commandCode = generateCommandCode(node, context);
    commandFiles[`commands/${commandName}.js`] = commandCode;
  }

  return commandFiles;
}

/**
 * Generates event files based on event nodes
 */
export function generateEventFiles(analysis: FlowAnalysis): GeneratedFiles {
  const eventFiles: GeneratedFiles = {};

  // Add default event handlers if no events are defined
  if (analysis.eventNodes.length === 0) {
    eventFiles['events/ready.js'] = generateDefaultReadyEvent();
    eventFiles['events/interactionCreate.js'] = generateDefaultInteractionEvent();
    return eventFiles;
  }

  // Generate a file for each event node
  for (const node of analysis.eventNodes) {
    const eventName = node.type === 'readyEvent' ? 'ready' :
                      node.type === 'messageEvent' ? 'messageCreate' :
                      node.type === 'interactionEvent' ? 'interactionCreate' :
                      node.data?.label?.toLowerCase().replace(/\s+/g, '-') ||
                      'custom-event';

    const context = {
      analysis,
      indent: '  ',
      currentIndentLevel: 0,
      variables: new Map<string, string>(),
      imports: new Set<string>(),
      usedNodeIds: new Set<string>()
    };

    const eventCode = generateEventCode(node, context);
    eventFiles[`events/${eventName}.js`] = eventCode;
  }

  // Always include the interactionCreate event if there are commands
  if (analysis.commandNodes.length > 0 && !eventFiles['events/interactionCreate.js']) {
    eventFiles['events/interactionCreate.js'] = generateDefaultInteractionEvent();
  }

  // Always include the ready event
  if (!eventFiles['events/ready.js']) {
    eventFiles['events/ready.js'] = generateDefaultReadyEvent();
  }

  return eventFiles;
}
