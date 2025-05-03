import type { Node, Edge, FlowAnalysis, NodeConnections } from './types';

/**
 * Analyzes the flow of nodes and edges to create a structured representation
 * of the bot's logic flow
 */
export function analyzeFlow(nodes: Node[], edges: Edge[]): FlowAnalysis {
  const nodeMap = new Map<string, Node>();
  const connectionMap = new Map<string, NodeConnections>();

  // Initialize collections
  const commandNodes: Node[] = [];
  const eventNodes: Node[] = [];
  const messageNodes: Node[] = [];
  const databaseNodes: Node[] = [];
  const apiNodes: Node[] = [];
  const conditionNodes: Node[] = [];
  const comparisonNodes: Node[] = [];

  // First pass: categorize nodes and build node map
  nodes.forEach(node => {
    nodeMap.set(node.id, node);

    // Initialize connection map entry
    connectionMap.set(node.id, {
      incoming: [],
      outgoing: [],
    });

    // Categorize nodes by type
    if (node.type?.includes('Command')) {
      commandNodes.push(node);
    } else if (node.type?.includes('Event')) {
      eventNodes.push(node);
    } else if (node.type === 'message') {
      messageNodes.push(node);
    } else if (node.type === 'database') {
      databaseNodes.push(node);
    } else if (node.type === 'api') {
      apiNodes.push(node);
    } else if (node.type === 'condition') {
      conditionNodes.push(node);
    } else if (node.type === 'comparison') {
      comparisonNodes.push(node);
    }
  });

  // Second pass: analyze edges and build connection map
  edges.forEach(edge => {
    const sourceConnections = connectionMap.get(edge.source);
    const targetConnections = connectionMap.get(edge.target);

    if (sourceConnections && targetConnections) {
      // Add to outgoing connections of source
      sourceConnections.outgoing.push(edge);

      // Add to incoming connections of target
      targetConnections.incoming.push(edge);

      // For condition nodes with true/false outputs
      if (edge.sourceHandle === 'true' || edge.sourceHandle === 'false') {
        const sourceNode = nodeMap.get(edge.source);

        if (sourceNode && sourceNode.type === 'comparison') {
          // Initialize true/false outgoing arrays if needed
          if (!sourceConnections.trueOutgoing) {
            sourceConnections.trueOutgoing = [];
          }
          if (!sourceConnections.falseOutgoing) {
            sourceConnections.falseOutgoing = [];
          }

          // Add to the appropriate array
          if (edge.sourceHandle === 'true') {
            sourceConnections.trueOutgoing.push(edge);
          } else {
            sourceConnections.falseOutgoing.push(edge);
          }
        }
      }
    }
  });

  // Find entry points (nodes that start execution flows)
  const entryPoints = [...commandNodes, ...eventNodes];

  return {
    nodeMap,
    connectionMap,
    entryPoints,
    commandNodes,
    eventNodes,
    messageNodes,
    databaseNodes,
    apiNodes,
    conditionNodes,
    comparisonNodes
  };
}
