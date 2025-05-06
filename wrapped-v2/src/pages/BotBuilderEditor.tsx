import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
} from 'reactflow';
import type {
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  Connection as ReactFlowConnection
} from 'reactflow';
import 'reactflow/dist/style.css';
import CommandNode from '../components/builder/CommandNode';
import EventNode from '../components/builder/EventNode';
import UtilityNode from '../components/builder/UtilityNode';
import MessageNode from '../components/builder/MessageNode';
import DatabaseNode from '../components/builder/DatabaseNode';
import APINode from '../components/builder/APINode';
import ConditionNode from '../components/builder/ConditionNode';
import ComparisonNode from '../components/builder/ComparisonNode';
import CustomEdge from '../components/builder/CustomEdge';
import generateBotFiles from '../utils/codeGenerator';
import type { GeneratedFiles } from '../utils/codeGenerator';
import downloadFiles from '../utils/fileDownloader';

// Define our own types for ReactFlow
interface Connection {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// Define NodeChange types
type NodeChange =
  | { type: 'add'; item: Node; }
  | { type: 'remove'; id: string; }
  | { type: 'select'; id: string; selected: boolean; }
  | { type: 'position'; id: string; position: { x: number; y: number; }; }
  | { type: 'dimensions'; id: string; dimensions: { width: number; height: number; }; };

// Define EdgeChange types
type EdgeChange =
  | { type: 'add'; item: Edge; }
  | { type: 'remove'; id: string; }
  | { type: 'select'; id: string; selected: boolean; };

// Define our own utility functions
const applyNodeChanges = (changes: NodeChange[], nodes: Node[]): Node[] => {
  return nodes.map(node => {
    const change = changes.find(c =>
      (c.type === 'remove' && 'id' in c && c.id === node.id) ||
      (c.type === 'select' && 'id' in c && c.id === node.id) ||
      (c.type === 'position' && 'id' in c && c.id === node.id) ||
      (c.type === 'dimensions' && 'id' in c && c.id === node.id)
    );

    if (change) {
      if (change.type === 'position' && 'position' in change) {
        return { ...node, position: change.position };
      } else if (change.type === 'select' && 'selected' in change) {
        return { ...node, selected: change.selected };
      } else if (change.type === 'dimensions' && 'dimensions' in change) {
        return { ...node, dimensions: change.dimensions };
      }
    }
    return node;
  }).filter(node => !changes.some(c => c.type === 'remove' && 'id' in c && c.id === node.id));
};

const applyEdgeChanges = (changes: EdgeChange[], edges: Edge[]): Edge[] => {
  return edges.map(edge => {
    const change = changes.find(c =>
      (c.type === 'remove' && 'id' in c && c.id === edge.id) ||
      (c.type === 'select' && 'id' in c && c.id === edge.id)
    );

    if (change && change.type === 'select' && 'selected' in change) {
      return { ...edge, selected: change.selected };
    }
    return edge;
  }).filter(edge => !changes.some(c => c.type === 'remove' && 'id' in c && c.id === edge.id));
};

const addEdge = (connection: Connection, edges: Edge[]): Edge[] => {
  // Check if an edge already exists between these nodes
  const existingEdgeIndex = edges.findIndex(
    edge => edge.source === connection.source && edge.target === connection.target
  );

  // If an edge already exists, don't add a new one
  if (existingEdgeIndex !== -1) {
    return edges;
  }

  const newEdge: Edge = {
    id: `${connection.source}-${connection.target}-${Date.now()}`,
    source: connection.source,
    target: connection.target,
    type: 'custom',
    data: { onDelete: (_id: string) => {} }, // This will be updated in the component
  };
  return [...edges, newEdge];
};

// Define our own Node and Edge types
interface Node {
  id: string;
  type?: string;
  data?: {
    label?: string;
    description?: string;
    [key: string]: any;
  };
  position: { x: number; y: number };
  dimensions?: { width: number; height: number };
  selected?: boolean;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  selected?: boolean;
  data?: {
    onDelete?: (id: string) => void;
    conditionResult?: 'true' | 'false';
    [key: string]: any;
  };
}

// Define node types
const nodeTypes = {
  command: CommandNode,
  messageCommand: CommandNode,
  readyEvent: EventNode,
  messageEvent: EventNode,
  interactionEvent: EventNode,
  message: MessageNode,
  database: DatabaseNode,
  api: APINode,
  condition: ConditionNode,
  comparison: ComparisonNode,
  embed: UtilityNode,
};

// Define edge types
const edgeTypes = {
  custom: CustomEdge,
};
const BotBuilderEditor = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedFile, setSelectedFile] = useState('index.js');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles>({
    'index.js': '// Your bot\'s main file will appear here',
    'config.js': '// Your configuration file will appear here',
    'commands/': '// Your commands will appear here',
    'events/': '// Your event handlers will appear here'
  });
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 1024);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white text-center p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">You can only use this service on a desktop or laptop computer.</h1>
          <p className="text-lg">Please switch to a desktop or laptop to use the Bot Builder.</p>
        </div>
      </div>
    );
  }

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  // Handle new connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      // Check if this is a connection from a comparison node with true/false handles
      const isFromComparison = connection.sourceHandle === 'true' || connection.sourceHandle === 'false';

      setEdges((eds) => {
        // For comparison nodes, we need to ensure the connection uses the correct handle
        if (isFromComparison) {
          // Find the source node to verify it's a comparison node
          const sourceNode = nodes.find(node => node.id === connection.source);
          if (sourceNode && sourceNode.type === 'comparison') {
            // Create a unique ID that includes the handle information
            const edgeId = `${connection.source}-${connection.sourceHandle}-${connection.target}-${Date.now()}`;

            // Create the new edge with the specific handle information
            const newEdge: Edge = {
              id: edgeId,
              source: connection.source,
              target: connection.target,
              sourceHandle: connection.sourceHandle || undefined,
              type: 'custom',
              data: {
                onDelete: (id: string) => {
                  setEdges((currentEdges) => currentEdges.filter((e) => e.id !== id));
                },
                conditionResult: connection.sourceHandle === 'true' ? 'true' : 'false'
              }
            };

            return [...eds, newEdge];
          }
        }

        // For regular connections
        const newEdges = addEdge(connection, eds);

        // If no new edge was added (because it already exists), return the current edges
        if (newEdges.length === eds.length) {
          return eds;
        }

        // Update the last edge with the onDelete function
        const lastEdge = newEdges[newEdges.length - 1];
        if (lastEdge && lastEdge.data) {
          lastEdge.data.onDelete = (id: string) => {
            setEdges((currentEdges) => currentEdges.filter((e) => e.id !== id));
          };
        }
        return newEdges;
      });
    },
    [nodes]
  );

  // Function to handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: ReactFlowNode) => {
    setSelectedNode(node as Node);
  }, []);

  // Function to delete a node and its related nodes
  const deleteNode = useCallback((nodeId: string) => {
    // Get the node to delete
    const nodeToDelete = nodes.find(node => node.id === nodeId);
    if (!nodeToDelete) return;

    // If it's a condition node, also delete all its comparison nodes
    if (nodeToDelete.type === 'condition' && nodeToDelete.data?.comparisons) {
      const comparisonIds = nodeToDelete.data.comparisons as string[];

      // Remove all comparison nodes
      setNodes((nds) => nds.filter(node =>
        node.id !== nodeId && !comparisonIds.includes(node.id)
      ));

      // Remove all related edges
      setEdges((eds) => eds.filter(edge =>
        edge.source !== nodeId &&
        !comparisonIds.includes(edge.target) &&
        !comparisonIds.includes(edge.source)
      ));
    } else {
      // For other node types, just remove the node
      setNodes((nds) => nds.filter(node => node.id !== nodeId));

      // Remove any edges connected to this node
      setEdges((eds) => eds.filter(edge =>
        edge.source !== nodeId && edge.target !== nodeId
      ));
    }
  }, [nodes]);

  // Function to handle key down events for deleting nodes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode.id);
        setSelectedNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, deleteNode]);

  // Function to add a comparison node connected to a condition node
  const addComparisonNode = (conditionId: string) => {
    // Find the condition node
    const conditionNode = nodes.find(node => node.id === conditionId);
    if (!conditionNode) return;

    // Calculate position for the comparison node (below the condition node)
    const comparisonX = conditionNode.position.x;
    const comparisonY = conditionNode.position.y + 150;

    // Create a unique ID for the comparison node
    const comparisonId = `comparison-${Date.now()}`;

    // Create the comparison node
    const comparisonNode: Node = {
      id: comparisonId,
      type: 'comparison',
      position: { x: comparisonX, y: comparisonY },
      data: {
        parentId: conditionId,
        leftValue: 'value1',
        operator: '==',
        rightValue: 'value2'
      }
    };

    // Create an edge connecting the condition to the comparison
    const newEdge: Edge = {
      id: `${conditionId}-${comparisonId}-${Date.now()}`,
      source: conditionId,
      target: comparisonId,
      type: 'custom',
      data: {
        onDelete: (id: string) => {
          setEdges((currentEdges) => currentEdges.filter((e) => e.id !== id));
        }
      }
    };

    // Update the condition node to track this comparison
    const updatedConditionNode = {
      ...conditionNode,
      data: {
        ...conditionNode.data,
        comparisons: [...(conditionNode.data?.comparisons || []), comparisonId]
      }
    };

    // Update the nodes and edges
    setNodes((nds) =>
      nds.map(n => n.id === conditionId ? updatedConditionNode : n).concat(comparisonNode)
    );
    setEdges((eds) => [...eds, newEdge]);
  };

  // Function to add a new node
  const addNode = (type: string) => {
    // Get node count to position new nodes in a grid
    const nodeCount = nodes.length;
    const xPos = 100 + (nodeCount % 3) * 250;
    const yPos = 100 + Math.floor(nodeCount / 3) * 150;

    // Create label based on type
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    if (type.includes('Event')) {
      label = type.replace('Event', ' Event');
    } else if (type.includes('Command')) {
      label = type.replace('Command', ' Command');
    }

    // Create base node data
    const baseNodeData = {
      label,
      description: `A ${type} node`,
    };

    // Add type-specific data
    let nodeData: any = { ...baseNodeData };

    if (type.includes('Event')) {
      nodeData.type = 'Event';
    } else if (type.includes('Command')) {
      nodeData.type = 'Command';
      nodeData.commandName = type === 'command' ? 'mycommand' : 'mymessagecommand';
      nodeData.responseType = 'text';
      nodeData.responseText = 'Hello, world!';
      nodeData.options = [];
    } else if (type === 'message') {
      nodeData.type = 'Message';
      nodeData.messageContent = 'Hello, world!';
      nodeData.useEmbed = false;
    } else if (type === 'database') {
      nodeData.type = 'Database';
      nodeData.operation = 'get';
      nodeData.databaseType = 'json';
      nodeData.key = 'myKey';
    } else if (type === 'api') {
      nodeData.type = 'API';
      nodeData.method = 'GET';
      nodeData.url = 'https://api.example.com/data';
      nodeData.responseVariable = 'apiResponse';
    } else if (type === 'condition') {
      nodeData.type = 'Condition';
      nodeData.comparisons = [];
      nodeData.logicalOperator = 'AND';
      // Add callback for adding comparisons
      nodeData.onAddComparison = addComparisonNode;
    } else if (type === 'embed') {
      nodeData.type = 'Embed';
      nodeData.embedData = {
        title: 'My Embed',
        description: 'This is an embed description',
        color: '#c94baf'
      };
    } else {
      nodeData.type = 'Utility';
    }

    // Create the node ID
    const nodeId = `${type}-${Date.now()}`;

    // For condition nodes, we need to add the ID to the data
    if (type === 'condition') {
      nodeData.id = nodeId;
    }

    const newNode: Node = {
      id: nodeId,
      type,
      position: { x: xPos, y: yPos },
      data: nodeData
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Function to generate bot files based on the flow
  const handleGenerateFiles = () => {
    // Use our utility to generate files based on nodes and edges
    const files = generateBotFiles(nodes, edges);
    setGeneratedFiles(files);
    setSelectedFile('index.js');

    // Switch to the preview tab
    setActiveTab('preview');
  };

  // Function to download the generated files
  const handleDownloadFiles = () => {
    // Use our utility to download files
    downloadFiles(generatedFiles, 'discord-bot.zip');
  };

  // Function to handle file selection in the preview panel
  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
  };

  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-6 px-4">
      <div className="max-w-7xl w-full themed-container p-4 flex flex-col h-[calc(100vh-6rem)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-theme-primary">Discord Bot Builder</h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'editor'
                  ? 'bg-theme-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Editor
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-theme-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Preview
            </button>

            <button
              onClick={handleGenerateFiles}
              className="px-4 py-2 bg-theme-success text-white rounded-md hover:bg-theme-success/80 transition-colors"
            >
              Generate Files
            </button>

            <button
              onClick={handleDownloadFiles}
              className="px-4 py-2 bg-theme-accent text-white rounded-md hover:bg-theme-accent/80 transition-colors"
            >
              Download
            </button>

            <Link
              to="/bot-builder"
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back
            </Link>
          </div>
        </div>

        {activeTab === 'editor' ? (
          <div className="flex flex-1 h-full">
            {/* Left sidebar - Block palette */}
            <div className="w-64 bg-gray-900/70 rounded-lg p-4 mr-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-theme-primary mb-3">Blocks</h2>

              <div className="space-y-2">
                <div className="text-white font-semibold mb-1">Commands</div>
                <button
                  onClick={() => addNode('command')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-primary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Slash Command
                </button>
                <button
                  onClick={() => addNode('messageCommand')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-primary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Message Command
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Events</div>
                <button
                  onClick={() => addNode('readyEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-primary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Ready Event
                </button>
                <button
                  onClick={() => addNode('messageEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-primary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Message Event
                </button>
                <button
                  onClick={() => addNode('interactionEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-primary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Interaction Event
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Responses</div>
                <button
                  onClick={() => addNode('message')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-accent py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Message Response
                </button>
                <button
                  onClick={() => addNode('embed')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-accent py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Embed Builder
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Logic</div>
                <button
                  onClick={() => addNode('condition')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-secondary py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Condition
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Data</div>
                <button
                  onClick={() => addNode('database')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-theme-success py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Database
                </button>
                <button
                  onClick={() => addNode('api')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-yellow-300 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> API Request
                </button>
              </div>
            </div>

            {/* Main flow editor area */}
            <div className="flex-1 bg-gray-900/70 rounded-lg overflow-hidden relative">
              <ReactFlow
                nodes={nodes as unknown as ReactFlowNode[]}
                edges={edges as unknown as ReactFlowEdge[]}
                onNodesChange={onNodesChange as unknown as OnNodesChange}
                onEdgesChange={onEdgesChange as unknown as OnEdgesChange}
                onConnect={onConnect as unknown as OnConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: 'custom' }}
                fitView
              >
                <Background color="#444" gap={16} />
                <Controls />
              </ReactFlow>
            </div>

            {/* Right sidebar - Properties panel */}
            <div className="w-72 bg-gray-900/70 rounded-lg p-4 ml-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-theme-primary mb-3">Properties</h2>

              {selectedNode ? (
                <div className="space-y-4">
                  {/* Common fields for all node types */}
                  <div>
                    <label className="block text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      value={selectedNode.data?.label || ''}
                      onChange={(e) => {
                        const updatedLabel = e.target.value;
                        setNodes((nds) =>
                          nds.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, data: { ...n.data, label: updatedLabel } }
                              : n
                          )
                        );
                        setSelectedNode((prev) =>
                          prev ? { ...prev, data: { ...prev.data, label: updatedLabel } } : null
                        );
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Description</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      value={selectedNode.data?.description || ''}
                      placeholder="Enter description"
                      onChange={(e) => {
                        const updatedDescription = e.target.value;
                        setNodes((nds) =>
                          nds.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, data: { ...n.data, description: updatedDescription } }
                              : n
                          )
                        );
                        setSelectedNode((prev) =>
                          prev ? { ...prev, data: { ...prev.data, description: updatedDescription } } : null
                        );
                      }}
                    />
                  </div>

                  {/* Command-specific fields */}
                  {selectedNode.type?.includes('Command') && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">Command Name</label>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">/</span>
                          <input
                            type="text"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                            value={selectedNode.data?.commandName || ''}
                            placeholder="command-name"
                            onChange={(e) => {
                              const updatedCommandName = e.target.value;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, commandName: updatedCommandName } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, commandName: updatedCommandName } } : null
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Response Type</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.responseType || 'text'}
                          onChange={(e) => {
                            const updatedResponseType = e.target.value as 'text' | 'embed' | 'both';
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, responseType: updatedResponseType } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, responseType: updatedResponseType } } : null
                            );
                          }}
                        >
                          <option value="text">Text Only</option>
                          <option value="embed">Embed Only</option>
                          <option value="both">Text & Embed</option>
                        </select>
                      </div>

                      {(selectedNode.data?.responseType === 'text' || selectedNode.data?.responseType === 'both') && (
                        <div>
                          <label className="block text-gray-300 mb-1">Response Text</label>
                          <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white h-20 font-mono text-sm"
                            value={selectedNode.data?.responseText || ''}
                            placeholder="Enter response text..."
                            onChange={(e) => {
                              const updatedResponseText = e.target.value;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, responseText: updatedResponseText } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, responseText: updatedResponseText } } : null
                              );
                            }}
                          ></textarea>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ephemeral"
                            className="mr-2"
                            checked={selectedNode.data?.ephemeral || false}
                            onChange={(e) => {
                              const isEphemeral = e.target.checked;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, ephemeral: isEphemeral } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, ephemeral: isEphemeral } } : null
                              );
                            }}
                          />
                          <label htmlFor="ephemeral" className="text-gray-300">Ephemeral Response</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="deferReply"
                            className="mr-2"
                            checked={selectedNode.data?.deferReply || false}
                            onChange={(e) => {
                              const isDeferReply = e.target.checked;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, deferReply: isDeferReply } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, deferReply: isDeferReply } } : null
                              );
                            }}
                          />
                          <label htmlFor="deferReply" className="text-gray-300">Defer Reply</label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Message-specific fields */}
                  {selectedNode.type === 'message' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">Message Content</label>
                        <textarea
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white h-20 font-mono text-sm"
                          value={selectedNode.data?.messageContent || ''}
                          placeholder="Enter message content..."
                          onChange={(e) => {
                            const updatedContent = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, messageContent: updatedContent } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, messageContent: updatedContent } } : null
                            );
                          }}
                        ></textarea>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="useEmbed"
                          className="mr-2"
                          checked={selectedNode.data?.useEmbed || false}
                          onChange={(e) => {
                            const useEmbed = e.target.checked;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, useEmbed } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, useEmbed } } : null
                            );
                          }}
                        />
                        <label htmlFor="useEmbed" className="text-gray-300">Include Embed</label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ephemeralMsg"
                          className="mr-2"
                          checked={selectedNode.data?.ephemeral || false}
                          onChange={(e) => {
                            const isEphemeral = e.target.checked;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, ephemeral: isEphemeral } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, ephemeral: isEphemeral } } : null
                            );
                          }}
                        />
                        <label htmlFor="ephemeralMsg" className="text-gray-300">Ephemeral Message</label>
                      </div>
                    </>
                  )}

                  {/* Database-specific fields */}
                  {selectedNode.type === 'database' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">Database Type</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.databaseType || 'json'}
                          onChange={(e) => {
                            const databaseType = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, databaseType } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, databaseType } } : null
                            );
                          }}
                        >
                          <option value="json">JSON File</option>
                          <option value="sqlite">SQLite</option>
                          <option value="mongodb">MongoDB</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Operation</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.operation || 'get'}
                          onChange={(e) => {
                            const operation = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, operation } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, operation } } : null
                            );
                          }}
                        >
                          <option value="get">Get</option>
                          <option value="set">Set</option>
                          <option value="delete">Delete</option>
                          <option value="list">List</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Key</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.key || ''}
                          placeholder="Enter key name"
                          onChange={(e) => {
                            const key = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, key } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, key } } : null
                            );
                          }}
                        />
                      </div>

                      {selectedNode.data?.operation === 'set' && (
                        <div>
                          <label className="block text-gray-300 mb-1">Value</label>
                          <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white h-20 font-mono text-sm"
                            value={selectedNode.data?.value || ''}
                            placeholder="Enter value (JSON)"
                            onChange={(e) => {
                              const value = e.target.value;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, value } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, value } } : null
                              );
                            }}
                          ></textarea>
                        </div>
                      )}
                    </>
                  )}

                  {/* API-specific fields */}
                  {selectedNode.type === 'api' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">HTTP Method</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.method || 'GET'}
                          onChange={(e) => {
                            const method = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, method } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, method } } : null
                            );
                          }}
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">URL</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.url || ''}
                          placeholder="https://api.example.com/data"
                          onChange={(e) => {
                            const url = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, url } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, url } } : null
                            );
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Response Variable Name</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.responseVariable || ''}
                          placeholder="apiResponse"
                          onChange={(e) => {
                            const responseVariable = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, responseVariable } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, responseVariable } } : null
                            );
                          }}
                        />
                      </div>

                      {(selectedNode.data?.method === 'POST' || selectedNode.data?.method === 'PUT') && (
                        <div>
                          <label className="block text-gray-300 mb-1">Request Body</label>
                          <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white h-20 font-mono text-sm"
                            value={selectedNode.data?.body || ''}
                            placeholder="Enter request body (JSON)"
                            onChange={(e) => {
                              const body = e.target.value;
                              setNodes((nds) =>
                                nds.map((n) =>
                                  n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, body } }
                                    : n
                                )
                              );
                              setSelectedNode((prev) =>
                                prev ? { ...prev, data: { ...prev.data, body } } : null
                              );
                            }}
                          ></textarea>
                        </div>
                      )}
                    </>
                  )}

                  {/* Condition-specific fields */}
                  {selectedNode.type === 'condition' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">Logical Operator</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.logicalOperator || 'AND'}
                          onChange={(e) => {
                            const logicalOperator = e.target.value as 'AND' | 'OR';
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, logicalOperator } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, logicalOperator } } : null
                            );
                          }}
                        >
                          <option value="AND">AND - All must be true</option>
                          <option value="OR">OR - Any can be true</option>
                        </select>
                      </div>

                      <div className="mt-2">
                        <label className="block text-gray-300 mb-1">Comparisons</label>
                        {selectedNode.data?.comparisons && selectedNode.data.comparisons.length > 0 ? (
                          <div className="space-y-2">
                            {selectedNode.data.comparisons.map((comparisonId: string, index: number) => {
                              const comparisonNode = nodes.find(n => n.id === comparisonId);
                              return (
                                <div key={comparisonId} className="bg-gray-800/50 p-2 rounded-md border border-gray-700">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-300">Comparison {index + 1}</span>
                                    <button
                                      onClick={() => {
                                        // Remove the comparison node and its edge
                                        setNodes((nds) => nds.filter(n => n.id !== comparisonId));
                                        setEdges((eds) => eds.filter(e =>
                                          !(e.source === selectedNode.id && e.target === comparisonId)
                                        ));

                                        // Update the condition node's comparisons array
                                        const updatedComparisons = selectedNode.data?.comparisons?.filter((id: string) => id !== comparisonId) || [];
                                        setNodes((nds) =>
                                          nds.map((n) =>
                                            n.id === selectedNode.id
                                              ? { ...n, data: { ...n.data, comparisons: updatedComparisons } }
                                              : n
                                          )
                                        );
                                        setSelectedNode((prev) =>
                                          prev ? { ...prev, data: { ...prev.data, comparisons: updatedComparisons } } : null
                                        );
                                      }}
                                      className="text-xs text-red-400 hover:text-red-300"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  {comparisonNode && (
                                    <div className="text-xs text-gray-300">
                                      {comparisonNode.data?.leftValue || 'value1'} {' '}
                                      {comparisonNode.data?.operator || '=='} {' '}
                                      {comparisonNode.data?.rightValue || 'value2'}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic p-2 text-center">
                            No comparisons added yet. Click "Add Comparison" to create one.
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          // Call the addComparisonNode function directly
                          addComparisonNode(selectedNode.id);
                        }}
                        className="mt-2 w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                      >
                        <span className="mr-1">+</span> Add Comparison
                      </button>
                    </>
                  )}

                  {/* Comparison-specific fields */}
                  {selectedNode.type === 'comparison' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-1">Left Value</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.leftValue || ''}
                          placeholder="Variable or value"
                          onChange={(e) => {
                            const leftValue = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, leftValue } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, leftValue } } : null
                            );
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Operator</label>
                        <select
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.operator || '=='}
                          onChange={(e) => {
                            const operator = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, operator } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, operator } } : null
                            );
                          }}
                        >
                          <option value="==">Equals (==)</option>
                          <option value="!=">Not Equals (!=)</option>
                          <option value=">">{`Greater Than (>)`}</option>
                          <option value="<">{`Less Than (<)`}</option>
                          <option value=">=">{`Greater Than or Equal (>=)`}</option>
                          <option value="<=">{`Less Than or Equal (<=)`}</option>
                          <option value="includes">Includes</option>
                          <option value="startsWith">Starts With</option>
                          <option value="endsWith">Ends With</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">Right Value</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                          value={selectedNode.data?.rightValue || ''}
                          placeholder="Variable or value"
                          onChange={(e) => {
                            const rightValue = e.target.value;
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? { ...n, data: { ...n.data, rightValue } }
                                  : n
                              )
                            );
                            setSelectedNode((prev) =>
                              prev ? { ...prev, data: { ...prev.data, rightValue } } : null
                            );
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Delete button for all node types */}
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        if (selectedNode) {
                          deleteNode(selectedNode.id);
                          setSelectedNode(null);
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Block
                    </button>
                    <p className="text-xs text-gray-400 mt-1 text-center">You can also press the Delete key</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Select a node to edit its properties</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 h-full">
            {/* File browser */}
            <div className="w-64 bg-gray-900/70 rounded-lg p-4 mr-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-wrapped-pink mb-3">Files</h2>

              <div className="space-y-1">
                {Object.keys(generatedFiles).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => handleFileSelect(filename)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                      selectedFile === filename
                        ? 'bg-wrapped-pink text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-pink-200'
                    }`}
                  >
                    {filename}
                  </button>
                ))}
              </div>
            </div>

            {/* Code preview */}
            <div className="flex-1 bg-gray-900/70 rounded-lg p-4 overflow-hidden">
              <div className="bg-gray-950 rounded-md p-4 h-full overflow-y-auto">
                <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {generatedFiles[selectedFile] || '// No content available for this file'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotBuilderEditor;
