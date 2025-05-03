import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

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
    const change = changes.find(c => c.id === node.id);
    if (change) {
      if (change.type === 'position' && 'position' in change) {
        return { ...node, position: change.position };
      } else if (change.type === 'select' && 'selected' in change) {
        return { ...node, selected: change.selected };
      }
    }
    return node;
  }).filter(node => !changes.some(c => c.type === 'remove' && c.id === node.id));
};

const applyEdgeChanges = (changes: EdgeChange[], edges: Edge[]): Edge[] => {
  return edges.map(edge => {
    const change = changes.find(c => c.id === edge.id);
    if (change && change.type === 'select' && 'selected' in change) {
      return { ...edge, selected: change.selected };
    }
    return edge;
  }).filter(edge => !changes.some(c => c.type === 'remove' && c.id === edge.id));
};

const addEdge = (connection: Connection, edges: Edge[]): Edge[] => {
  const newEdge: Edge = {
    id: `${connection.source}-${connection.target}-${Date.now()}`,
    source: connection.source,
    target: connection.target,
    type: 'custom',
    data: { onDelete: (id: string) => {} }, // This will be updated in the component
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
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    onDelete?: (id: string) => void;
    [key: string]: any;
  };
}

// Import node types directly
import CommandNode from '../components/builder/CommandNode';
import EventNode from '../components/builder/EventNode';
import UtilityNode from '../components/builder/UtilityNode';
import CustomEdge from '../components/builder/CustomEdge';

// Define node types
const nodeTypes = {
  command: CommandNode,
  messageCommand: CommandNode,
  readyEvent: EventNode,
  messageEvent: EventNode,
  interactionEvent: EventNode,
  database: UtilityNode,
  api: UtilityNode,
  embed: UtilityNode,
};

// Define edge types
const edgeTypes = {
  custom: CustomEdge,
};
import generateBotFiles from '../utils/codeGenerator';
import downloadFiles from '../utils/fileDownloader';
const BotBuilderEditor = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedFile, setSelectedFile] = useState('index.js');
  const [generatedFiles, setGeneratedFiles] = useState({
    'index.js': '// Your bot\'s main file will appear here',
    'config.js': '// Your configuration file will appear here',
    'commands/': '// Your commands will appear here',
    'events/': '// Your event handlers will appear here'
  });

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
      setEdges((eds) => {
        const newEdges = addEdge(connection, eds);
        // Update the last edge with the onDelete function
        const lastEdge = newEdges[newEdges.length - 1];
        if (lastEdge && lastEdge.data) {
          lastEdge.data.onDelete = (id: string) => {
            setEdges((eds) => eds.filter((e) => e.id !== id));
          };
        }
        return newEdges;
      });
    },
    []
  );

  // Function to handle edge deletion
  const onEdgeDelete = useCallback((id: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

  // Function to handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Function to handle key down events for deleting nodes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedNode) {
        setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
        setSelectedNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode]);

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

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: xPos, y: yPos },
      data: {
        label,
        description: `A ${type} node`,
        type: type.includes('Event') ? 'Event' : type.includes('Command') ? 'Command' : 'Utility'
      }
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-6 px-4">
      <div className="max-w-7xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/30 flex flex-col h-[calc(100vh-6rem)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-saira font-extrabold text-wrapped-pink">Discord Bot Builder</h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'editor'
                  ? 'bg-wrapped-pink text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Editor
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-wrapped-pink text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Preview
            </button>

            <button
              onClick={handleGenerateFiles}
              className="px-4 py-2 bg-wrapped-green text-gray-900 rounded-md hover:bg-green-400 transition-colors"
            >
              Generate Files
            </button>

            <button
              onClick={handleDownloadFiles}
              className="px-4 py-2 bg-wrapped-blue text-gray-900 rounded-md hover:bg-blue-400 transition-colors"
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
              <h2 className="text-lg font-bold text-wrapped-pink mb-3">Blocks</h2>

              <div className="space-y-2">
                <div className="text-white font-semibold mb-1">Commands</div>
                <button
                  onClick={() => addNode('command')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Slash Command
                </button>
                <button
                  onClick={() => addNode('messageCommand')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Message Command
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Events</div>
                <button
                  onClick={() => addNode('readyEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Ready Event
                </button>
                <button
                  onClick={() => addNode('messageEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Message Event
                </button>
                <button
                  onClick={() => addNode('interactionEvent')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Interaction Event
                </button>

                <div className="text-white font-semibold mb-1 mt-4">Utilities</div>
                <button
                  onClick={() => addNode('database')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Database
                </button>
                <button
                  onClick={() => addNode('api')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> API Integration
                </button>
                <button
                  onClick={() => addNode('embed')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-pink-200 py-2 px-3 rounded-md transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Embed Builder
                </button>
              </div>
            </div>

            {/* Main flow editor area */}
            <div className="flex-1 bg-gray-900/70 rounded-lg overflow-hidden relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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
              <h2 className="text-lg font-bold text-wrapped-pink mb-3">Properties</h2>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      value={selectedNode.data?.label || ''}
                      onChange={(e) => {
                        // Update node label
                        console.log('Updated node label:', e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Description</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="Enter description"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="option1" className="mr-2" />
                        <label htmlFor="option1" className="text-gray-300">Ephemeral Response</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="option2" className="mr-2" />
                        <label htmlFor="option2" className="text-gray-300">Defer Reply</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Code</label>
                    <textarea
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white h-40 font-mono text-sm"
                      placeholder="Custom code here..."
                    ></textarea>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        if (selectedNode) {
                          setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
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
