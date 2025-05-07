import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface JsonViewerProps {
  data: any;
  maxHeight?: string;
  className?: string;
}

interface TreeNode {
  key: string;
  value: any;
  type: string;
  expanded: boolean;
  children?: TreeNode[];
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, maxHeight = '400px', className = '' }) => {
  const [viewMode, setViewMode] = useState<'tree' | 'raw'>('raw');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Function to convert JSON data to a tree structure
  const buildTree = (data: any, path = 'root'): TreeNode[] => {
    if (typeof data !== 'object' || data === null) {
      return [];
    }

    return Object.entries(data).map(([key, value]) => {
      const currentPath = `${path}.${key}`;
      const valueType = typeof value;
      const isObject = valueType === 'object' && value !== null;
      
      const node: TreeNode = {
        key,
        value: isObject ? undefined : value,
        type: Array.isArray(value) ? 'array' : valueType,
        expanded: expandedNodes.has(currentPath),
      };

      if (isObject) {
        node.children = buildTree(value, currentPath);
      }

      return node;
    });
  };

  // Toggle node expansion
  const toggleNode = (path: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(path)) {
      newExpandedNodes.delete(path);
    } else {
      newExpandedNodes.add(path);
    }
    setExpandedNodes(newExpandedNodes);
  };

  // Render a tree node
  const renderTreeNode = (node: TreeNode, path = 'root', level = 0) => {
    const currentPath = `${path}.${node.key}`;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={currentPath} style={{ paddingLeft: `${level * 16}px` }}>
        <div className="flex items-start">
          {hasChildren && (
            <button 
              onClick={() => toggleNode(currentPath)}
              className="mr-1 text-gray-400 hover:text-white focus:outline-none"
            >
              {node.expanded ? '▼' : '►'}
            </button>
          )}
          <span className="text-theme-primary">{node.key}</span>
          <span className="text-gray-400 mx-1">:</span>
          {hasChildren ? (
            <span className="text-gray-300">
              {Array.isArray(node.value) ? '[]' : '{}'}
            </span>
          ) : (
            <span className={`
              ${node.type === 'string' ? 'text-green-400' : ''}
              ${node.type === 'number' ? 'text-blue-400' : ''}
              ${node.type === 'boolean' ? 'text-yellow-400' : ''}
              ${node.value === null ? 'text-red-400' : ''}
            `}>
              {node.type === 'string' ? `"${node.value}"` : String(node.value)}
            </span>
          )}
        </div>
        
        {hasChildren && node.expanded && (
          <div>
            {node.children!.map(childNode => 
              renderTreeNode(childNode, currentPath, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Format JSON for display
  const formattedJson = typeof data === 'object' && data !== null
    ? JSON.stringify(data, null, 2)
    : String(data);

  // Build tree data
  const treeData = typeof data === 'object' && data !== null
    ? buildTree(data)
    : [];

  return (
    <div className={`bg-gray-800 rounded-md border border-gray-700 ${className}`}>
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
        <div className="text-sm text-gray-300">Response Body</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2 py-1 text-xs rounded ${
              viewMode === 'raw' 
                ? 'bg-theme-primary text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Raw
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-2 py-1 text-xs rounded ${
              viewMode === 'tree' 
                ? 'bg-theme-primary text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tree
          </button>
        </div>
      </div>
      
      <div style={{ maxHeight, overflow: 'auto' }}>
        {viewMode === 'raw' ? (
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{ 
              margin: 0, 
              borderRadius: 0,
              background: 'transparent',
              fontSize: '0.875rem',
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {formattedJson}
          </SyntaxHighlighter>
        ) : (
          <div className="p-3 font-mono text-sm">
            {typeof data === 'object' && data !== null ? (
              treeData.map(node => renderTreeNode(node))
            ) : (
              <div className="text-gray-300">{String(data)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
