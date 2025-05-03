import type { Node, Edge, GeneratedFiles } from './types';
import { analyzeFlow } from './flowAnalyzer';
import {
  generateIndexFile,
  generateConfigFile,
  generatePackageFile,
  generateReadmeFile,
  generateDeployCommandsFile,
  generateCommandFiles,
  generateEventFiles
} from './fileGenerators';

/**
 * Main compiler function that generates bot files from nodes and edges
 */
export function generateBotFiles(nodes: Node[], edges: Edge[]): GeneratedFiles {
  // Step 1: Analyze the flow to understand the connections
  const flowAnalysis = analyzeFlow(nodes, edges);

  // Step 2: Generate the core files
  const files: GeneratedFiles = {
    'index.js': generateIndexFile(),
    'config.js': generateConfigFile(),
    'package.json': generatePackageFile(),
    'README.md': generateReadmeFile(),
    'deploy-commands.js': generateDeployCommandsFile()
  };

  // Step 3: Generate command files
  const commandFiles = generateCommandFiles(flowAnalysis);
  Object.assign(files, commandFiles);

  // Step 4: Generate event files
  const eventFiles = generateEventFiles(flowAnalysis);
  Object.assign(files, eventFiles);

  // Step 5: Create necessary directories
  files['commands/.gitkeep'] = '';
  files['events/.gitkeep'] = '';
  files['data/.gitkeep'] = '';

  return files;
}

export default generateBotFiles;
export type { Node, Edge, GeneratedFiles } from './types';
