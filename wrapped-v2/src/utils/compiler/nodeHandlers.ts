import type { Node, Edge, CodeGenContext } from './types';

/**
 * Base utility functions for code generation
 */
export function indent(context: CodeGenContext): string {
  return context.indent.repeat(context.currentIndentLevel);
}

export function increaseIndent(context: CodeGenContext): void {
  context.currentIndentLevel++;
}

export function decreaseIndent(context: CodeGenContext): void {
  if (context.currentIndentLevel > 0) {
    context.currentIndentLevel--;
  }
}

/**
 * Generates code for a command node
 */
export function generateCommandCode(node: Node, context: CodeGenContext): string {
  const { data } = node;
  const commandName = data?.commandName || 'command';
  const description = data?.description || 'A custom command';
  const responseType = data?.responseType || 'text';
  const responseText = data?.responseText || 'Command executed!';
  const ephemeral = data?.ephemeral || false;
  const deferReply = data?.deferReply || false;

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  // Add required imports
  context.imports.add('const { SlashCommandBuilder } = require(\'discord.js\');');

  let code = '';
  code += 'module.exports = {\n';
  code += '  data: new SlashCommandBuilder()\n';
  code += `    .setName('${commandName}')\n`;
  code += `    .setDescription('${description}')\n`;

  // Add command options here if needed

  code += '  ,\n\n';
  code += '  async execute(interaction) {\n';

  // Handle defer reply
  if (deferReply) {
    code += `    await interaction.deferReply(${ephemeral ? '{ ephemeral: true }' : ''});\n\n`;
  }

  // Find outgoing connections to generate the command body
  const connections = context.analysis.connectionMap.get(node.id);
  if (connections && connections.outgoing.length > 0) {
    // Generate code for connected nodes
    const nextNodeIds = connections.outgoing.map(edge => edge.target);

    // For each connected node, generate its code
    for (const nextNodeId of nextNodeIds) {
      const nextNode = context.analysis.nodeMap.get(nextNodeId);
      if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
        const nodeCode = generateNodeCode(nextNode, context);
        code += nodeCode;
      }
    }
  } else {
    // No connections, use the default response
    if (responseType === 'text' || responseType === 'both') {
      code += `    await interaction.${deferReply ? 'editReply' : 'reply'}({\n`;
      code += `      content: '${responseText}',\n`;
      if (ephemeral && !deferReply) {
        code += '      ephemeral: true,\n';
      }
      code += '    });\n';
    }
  }

  code += '  },\n';
  code += '};\n';

  return code;
}

/**
 * Generates code for an event node
 */
export function generateEventCode(node: Node, context: CodeGenContext): string {
  const { data, type } = node;
  const eventName = type === 'readyEvent' ? 'ready' :
                    type === 'messageEvent' ? 'messageCreate' :
                    type === 'interactionEvent' ? 'interactionCreate' :
                    'unknown';

  const isOnce = eventName === 'ready';
  const paramName = eventName === 'ready' ? 'client' :
                    eventName === 'messageCreate' ? 'message' :
                    eventName === 'interactionCreate' ? 'interaction' :
                    'args';

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  let code = '';
  code += 'module.exports = {\n';
  code += `  name: '${eventName}',\n`;
  code += `  once: ${isOnce},\n`;
  code += `  async execute(${paramName}) {\n`;

  // For interaction events, add command handling
  if (eventName === 'interactionCreate') {
    code += '    if (!interaction.isChatInputCommand()) return;\n\n';
    code += '    const command = interaction.client.commands.get(interaction.commandName);\n\n';
    code += '    if (!command) {\n';
    code += '      console.error(`No command matching ${interaction.commandName} was found.`);\n';
    code += '      return;\n';
    code += '    }\n\n';
    code += '    try {\n';
    code += '      await command.execute(interaction);\n';
    code += '    } catch (error) {\n';
    code += '      console.error(error);\n';
    code += '      if (interaction.replied || interaction.deferred) {\n';
    code += '        await interaction.followUp({ content: \'There was an error while executing this command!\', ephemeral: true });\n';
    code += '      } else {\n';
    code += '        await interaction.reply({ content: \'There was an error while executing this command!\', ephemeral: true });\n';
    code += '      }\n';
    code += '    }\n';
  } else {
    // For other events, find outgoing connections
    const connections = context.analysis.connectionMap.get(node.id);
    if (connections && connections.outgoing.length > 0) {
      // Generate code for connected nodes
      const nextNodeIds = connections.outgoing.map(edge => edge.target);

      // For each connected node, generate its code
      for (const nextNodeId of nextNodeIds) {
        const nextNode = context.analysis.nodeMap.get(nextNodeId);
        if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
          const nodeCode = generateNodeCode(nextNode, context);
          code += nodeCode;
        }
      }
    } else {
      // No connections, add a default log
      code += `    console.log('${eventName} event triggered');\n`;
    }
  }

  code += '  },\n';
  code += '};\n';

  return code;
}

/**
 * Generates code for a message node
 */
export function generateMessageCode(node: Node, context: CodeGenContext): string {
  const { data } = node;
  const messageContent = data?.messageContent || 'Hello, world!';
  const useEmbed = data?.useEmbed || false;
  const ephemeral = data?.ephemeral || false;

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  let code = '';

  // Determine if we're in an interaction context
  const isInteraction = true; // This is a simplification - in a real compiler we'd determine this from context

  if (isInteraction) {
    code += `${indent(context)}await interaction.${context.variables.has('deferred') ? 'editReply' : 'reply'}({\n`;
    increaseIndent(context);

    code += `${indent(context)}content: '${messageContent}',\n`;

    if (useEmbed && data?.embedData) {
      context.imports.add('const { EmbedBuilder } = require(\'discord.js\');');

      code += `${indent(context)}embeds: [new EmbedBuilder()\n`;
      increaseIndent(context);

      if (data.embedData.title) {
        code += `${indent(context)}.setTitle('${data.embedData.title}')\n`;
      }

      if (data.embedData.description) {
        code += `${indent(context)}.setDescription('${data.embedData.description}')\n`;
      }

      if (data.embedData.color) {
        code += `${indent(context)}.setColor('${data.embedData.color}')\n`;
      }

      // Add other embed properties as needed

      decreaseIndent(context);
      code += `${indent(context)}],\n`;
    }

    if (ephemeral && !context.variables.has('deferred')) {
      code += `${indent(context)}ephemeral: true,\n`;
    }

    decreaseIndent(context);
    code += `${indent(context)}});\n\n`;
  } else {
    // For non-interaction contexts (e.g., message events)
    code += `${indent(context)}await message.channel.send({\n`;
    increaseIndent(context);

    code += `${indent(context)}content: '${messageContent}',\n`;

    if (useEmbed && data?.embedData) {
      context.imports.add('const { EmbedBuilder } = require(\'discord.js\');');

      code += `${indent(context)}embeds: [new EmbedBuilder()\n`;
      increaseIndent(context);

      if (data.embedData.title) {
        code += `${indent(context)}.setTitle('${data.embedData.title}')\n`;
      }

      if (data.embedData.description) {
        code += `${indent(context)}.setDescription('${data.embedData.description}')\n`;
      }

      if (data.embedData.color) {
        code += `${indent(context)}.setColor('${data.embedData.color}')\n`;
      }

      // Add other embed properties as needed

      decreaseIndent(context);
      code += `${indent(context)}],\n`;
    }

    decreaseIndent(context);
    code += `${indent(context)}});\n\n`;
  }

  // Find outgoing connections to continue the flow
  const connections = context.analysis.connectionMap.get(node.id);
  if (connections && connections.outgoing.length > 0) {
    // Generate code for connected nodes
    const nextNodeIds = connections.outgoing.map(edge => edge.target);

    // For each connected node, generate its code
    for (const nextNodeId of nextNodeIds) {
      const nextNode = context.analysis.nodeMap.get(nextNodeId);
      if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
        const nodeCode = generateNodeCode(nextNode, context);
        code += nodeCode;
      }
    }
  }

  return code;
}

/**
 * Generates code for a database node
 */
export function generateDatabaseCode(node: Node, context: CodeGenContext): string {
  const { data } = node;
  const operation = data?.operation || 'get';
  const databaseType = data?.databaseType || 'json';
  const key = data?.key || 'myKey';
  const value = data?.value || '{}';

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  let code = '';

  // Add required imports based on database type
  if (databaseType === 'json') {
    context.imports.add('const fs = require(\'fs\');');
    context.imports.add('const path = require(\'path\');');
  } else if (databaseType === 'sqlite') {
    context.imports.add('const sqlite3 = require(\'sqlite3\').verbose();');
  } else if (databaseType === 'mongodb') {
    context.imports.add('const { MongoClient } = require(\'mongodb\');');
  }

  // Generate database operation code
  if (databaseType === 'json') {
    const dbVarName = `db_${node.id.replace(/-/g, '_')}`;

    code += `${indent(context)}// JSON Database Operation\n`;
    code += `${indent(context)}const dbPath = path.join(__dirname, '../data/database.json');\n`;
    code += `${indent(context)}let ${dbVarName} = {};\n\n`;

    code += `${indent(context)}// Ensure the database file exists\n`;
    code += `${indent(context)}if (fs.existsSync(dbPath)) {\n`;
    increaseIndent(context);
    code += `${indent(context)}${dbVarName} = JSON.parse(fs.readFileSync(dbPath, 'utf8'));\n`;
    decreaseIndent(context);
    code += `${indent(context)}} else {\n`;
    increaseIndent(context);
    code += `${indent(context)}// Create directory if it doesn't exist\n`;
    code += `${indent(context)}const dir = path.dirname(dbPath);\n`;
    code += `${indent(context)}if (!fs.existsSync(dir)) {\n`;
    increaseIndent(context);
    code += `${indent(context)}fs.mkdirSync(dir, { recursive: true });\n`;
    decreaseIndent(context);
    code += `${indent(context)}}\n`;
    code += `${indent(context)}fs.writeFileSync(dbPath, '{}', 'utf8');\n`;
    decreaseIndent(context);
    code += `${indent(context)}}\n\n`;

    if (operation === 'get') {
      code += `${indent(context)}const ${key}Value = ${dbVarName}['${key}'];\n`;
      code += `${indent(context)}console.log('Retrieved value:', ${key}Value);\n\n`;
    } else if (operation === 'set') {
      code += `${indent(context)}${dbVarName}['${key}'] = ${value};\n`;
      code += `${indent(context)}fs.writeFileSync(dbPath, JSON.stringify(${dbVarName}, null, 2), 'utf8');\n`;
      code += `${indent(context)}console.log('Saved value for key: ${key}');\n\n`;
    } else if (operation === 'delete') {
      code += `${indent(context)}delete ${dbVarName}['${key}'];\n`;
      code += `${indent(context)}fs.writeFileSync(dbPath, JSON.stringify(${dbVarName}, null, 2), 'utf8');\n`;
      code += `${indent(context)}console.log('Deleted key: ${key}');\n\n`;
    } else if (operation === 'list') {
      code += `${indent(context)}const keys = Object.keys(${dbVarName});\n`;
      code += `${indent(context)}console.log('Database keys:', keys);\n\n`;
    }
  }

  // Find outgoing connections to continue the flow
  const connections = context.analysis.connectionMap.get(node.id);
  if (connections && connections.outgoing.length > 0) {
    // Generate code for connected nodes
    const nextNodeIds = connections.outgoing.map(edge => edge.target);

    // For each connected node, generate its code
    for (const nextNodeId of nextNodeIds) {
      const nextNode = context.analysis.nodeMap.get(nextNodeId);
      if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
        const nodeCode = generateNodeCode(nextNode, context);
        code += nodeCode;
      }
    }
  }

  return code;
}

/**
 * Generates code for an API node
 */
export function generateApiCode(node: Node, context: CodeGenContext): string {
  const { data } = node;
  const method = data?.method || 'GET';
  const url = data?.url || 'https://api.example.com/data';
  const responseVariable = data?.responseVariable || 'apiResponse';
  const body = data?.body || '';

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  // Add required imports
  context.imports.add('const axios = require(\'axios\');');

  let code = '';
  code += `${indent(context)}// API Request\n`;
  code += `${indent(context)}try {\n`;
  increaseIndent(context);

  code += `${indent(context)}const ${responseVariable} = await axios({\n`;
  increaseIndent(context);
  code += `${indent(context)}method: '${method}',\n`;
  code += `${indent(context)}url: '${url}',\n`;

  if ((method === 'POST' || method === 'PUT') && body) {
    code += `${indent(context)}data: ${body},\n`;
  }

  code += `${indent(context)}headers: {\n`;
  increaseIndent(context);
  code += `${indent(context)}'Content-Type': 'application/json',\n`;
  decreaseIndent(context);
  code += `${indent(context)}},\n`;

  decreaseIndent(context);
  code += `${indent(context)}});\n\n`;

  code += `${indent(context)}console.log('API response:', ${responseVariable}.data);\n`;

  decreaseIndent(context);
  code += `${indent(context)}} catch (error) {\n`;
  increaseIndent(context);
  code += `${indent(context)}console.error('API request failed:', error.message);\n`;
  decreaseIndent(context);
  code += `${indent(context)}}\n\n`;

  // Add the response variable to the context
  context.variables.set(responseVariable, 'object');

  // Find outgoing connections to continue the flow
  const connections = context.analysis.connectionMap.get(node.id);
  if (connections && connections.outgoing.length > 0) {
    // Generate code for connected nodes
    const nextNodeIds = connections.outgoing.map(edge => edge.target);

    // For each connected node, generate its code
    for (const nextNodeId of nextNodeIds) {
      const nextNode = context.analysis.nodeMap.get(nextNodeId);
      if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
        const nodeCode = generateNodeCode(nextNode, context);
        code += nodeCode;
      }
    }
  }

  return code;
}

/**
 * Generates code for a condition node
 */
export function generateConditionCode(node: Node, context: CodeGenContext): string {
  const { data } = node;
  const logicalOperator = data?.logicalOperator || 'AND';
  const comparisons = data?.comparisons || [];

  // Track that we've used this node
  context.usedNodeIds.add(node.id);

  let code = '';
  code += `${indent(context)}// Condition Check\n`;

  // If there are no comparisons, use a default condition
  if (!comparisons.length) {
    code += `${indent(context)}if (true) {\n`;
    increaseIndent(context);

    // Find true path connections
    const connections = context.analysis.connectionMap.get(node.id);
    if (connections && connections.outgoing.length > 0) {
      // Generate code for connected nodes
      const nextNodeIds = connections.outgoing.map(edge => edge.target);

      // For each connected node, generate its code
      for (const nextNodeId of nextNodeIds) {
        const nextNode = context.analysis.nodeMap.get(nextNodeId);
        if (nextNode && !context.usedNodeIds.has(nextNodeId)) {
          const nodeCode = generateNodeCode(nextNode, context);
          code += nodeCode;
        }
      }
    }

    decreaseIndent(context);
    code += `${indent(context)}}\n\n`;
    return code;
  }

  // Build condition expression from comparison nodes
  let conditionExpr = '';

  for (let i = 0; i < comparisons.length; i++) {
    const comparisonId = comparisons[i];
    const comparisonNode = context.analysis.nodeMap.get(comparisonId);

    if (comparisonNode) {
      const leftValue = comparisonNode.data?.leftValue || 'value1';
      const operator = comparisonNode.data?.operator || '==';
      const rightValue = comparisonNode.data?.rightValue || 'value2';

      // Convert operator to JavaScript
      let jsOperator = operator;
      if (operator === '==') jsOperator = '===';
      else if (operator === '!=') jsOperator = '!==';
      else if (operator === 'includes') {
        conditionExpr += `${leftValue}.includes(${rightValue})`;
        continue;
      } else if (operator === 'startsWith') {
        conditionExpr += `${leftValue}.startsWith(${rightValue})`;
        continue;
      } else if (operator === 'endsWith') {
        conditionExpr += `${leftValue}.endsWith(${rightValue})`;
        continue;
      }

      conditionExpr += `${leftValue} ${jsOperator} ${rightValue}`;

      // Add logical operator if not the last comparison
      if (i < comparisons.length - 1) {
        conditionExpr += ` ${logicalOperator.toLowerCase()} `;
      }
    }
  }

  code += `${indent(context)}if (${conditionExpr}) {\n`;
  increaseIndent(context);

  // Find true path connections
  const connections = context.analysis.connectionMap.get(node.id);
  const comparisonConnections = comparisons.map(id => context.analysis.connectionMap.get(id)).filter(Boolean);

  // Process true path from comparison nodes
  for (const conn of comparisonConnections) {
    if (conn && conn.trueOutgoing && conn.trueOutgoing.length > 0) {
      for (const edge of conn.trueOutgoing) {
        const nextNode = context.analysis.nodeMap.get(edge.target);
        if (nextNode && !context.usedNodeIds.has(nextNode.id)) {
          const nodeCode = generateNodeCode(nextNode, context);
          code += nodeCode;
        }
      }
    }
  }

  decreaseIndent(context);
  code += `${indent(context)}} else {\n`;
  increaseIndent(context);

  // Process false path from comparison nodes
  for (const conn of comparisonConnections) {
    if (conn && conn.falseOutgoing && conn.falseOutgoing.length > 0) {
      for (const edge of conn.falseOutgoing) {
        const nextNode = context.analysis.nodeMap.get(edge.target);
        if (nextNode && !context.usedNodeIds.has(nextNode.id)) {
          const nodeCode = generateNodeCode(nextNode, context);
          code += nodeCode;
        }
      }
    }
  }

  decreaseIndent(context);
  code += `${indent(context)}}\n\n`;

  return code;
}

/**
 * Generates code for a comparison node
 */
export function generateComparisonCode(node: Node, context: CodeGenContext): string {
  // Comparison nodes don't generate standalone code
  // Their logic is incorporated into condition nodes
  context.usedNodeIds.add(node.id);
  return '';
}

/**
 * Main function to generate code for any node type
 */
export function generateNodeCode(node: Node, context: CodeGenContext): string {
  if (!node) return '';

  switch (node.type) {
    case 'command':
    case 'messageCommand':
      return generateCommandCode(node, context);
    case 'readyEvent':
    case 'messageEvent':
    case 'interactionEvent':
      return generateEventCode(node, context);
    case 'message':
      return generateMessageCode(node, context);
    case 'database':
      return generateDatabaseCode(node, context);
    case 'api':
      return generateApiCode(node, context);
    case 'condition':
      return generateConditionCode(node, context);
    case 'comparison':
      return generateComparisonCode(node, context);
    default:
      return `${indent(context)}// Unsupported node type: ${node.type}\n`;
  }
}
