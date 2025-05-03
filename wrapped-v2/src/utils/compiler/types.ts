// Define types for the compiler

// Node and Edge types (similar to ReactFlow but independent)
export interface Node {
  id: string;
  type?: string;
  data?: {
    id?: string;
    label?: string;
    description?: string;
    comparisons?: string[];
    logicalOperator?: 'AND' | 'OR';
    commandName?: string;
    responseType?: 'text' | 'embed' | 'both';
    responseText?: string;
    ephemeral?: boolean;
    deferReply?: boolean;
    messageContent?: string;
    useEmbed?: boolean;
    embedData?: any;
    operation?: 'get' | 'set' | 'delete' | 'list';
    databaseType?: 'json' | 'sqlite' | 'mongodb';
    key?: string;
    value?: string;
    collection?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url?: string;
    headers?: Record<string, string>;
    body?: string;
    responseVariable?: string;
    leftValue?: string;
    operator?: string;
    rightValue?: string;
    parentId?: string;
    [key: string]: any;
  };
  position: { x: number; y: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: {
    conditionResult?: 'true' | 'false';
    [key: string]: any;
  };
}

// Output file structure
export interface GeneratedFiles {
  [key: string]: string;
}

// Node connection map for analyzing flow
export interface NodeConnections {
  incoming: Edge[];
  outgoing: Edge[];
  trueOutgoing?: Edge[]; // For condition nodes
  falseOutgoing?: Edge[]; // For condition nodes
}

// Flow analysis result
export interface FlowAnalysis {
  nodeMap: Map<string, Node>;
  connectionMap: Map<string, NodeConnections>;
  entryPoints: Node[]; // Nodes that start execution flows (commands, events)
  commandNodes: Node[];
  eventNodes: Node[];
  messageNodes: Node[];
  databaseNodes: Node[];
  apiNodes: Node[];
  conditionNodes: Node[];
  comparisonNodes: Node[];
}

// Code generation context
export interface CodeGenContext {
  analysis: FlowAnalysis;
  indent: string;
  currentIndentLevel: number;
  variables: Map<string, string>; // Variable name to type
  imports: Set<string>;
  usedNodeIds: Set<string>;
}
