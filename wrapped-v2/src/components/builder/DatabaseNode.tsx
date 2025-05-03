import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface DatabaseNodeProps {
  data: {
    label: string;
    description?: string;
    type?: string;
    operation: 'get' | 'set' | 'delete' | 'list';
    databaseType: 'json' | 'sqlite' | 'mongodb';
    key?: string;
    value?: string;
    collection?: string;
  };
  selected: boolean;
}

const DatabaseNode = ({ data, selected }: DatabaseNodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${
      selected 
        ? 'bg-gray-800 border-wrapped-green shadow-lg shadow-wrapped-green/20' 
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[180px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-wrapped-green mr-2"></div>
        <div className="font-bold text-white">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-300 mb-2">{data.description}</div>
      )}
      
      <div className="text-xs text-gray-300 mb-1">
        {data.operation.charAt(0).toUpperCase() + data.operation.slice(1)} operation
      </div>
      
      <div className="text-xs text-gray-400 mb-1">
        {data.databaseType === 'json' ? 'JSON Database' : 
         data.databaseType === 'sqlite' ? 'SQLite Database' : 
         'MongoDB Database'}
      </div>
      
      {data.key && (
        <div className="text-xs text-gray-400 mb-1 truncate max-w-[160px]">
          Key: {data.key}
        </div>
      )}
      
      {data.collection && (
        <div className="text-xs text-gray-400 mb-1 truncate max-w-[160px]">
          Collection: {data.collection}
        </div>
      )}
      
      <div className="text-xs text-gray-400">{data.type || 'Database'}</div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-wrapped-green border-2 border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-wrapped-green border-2 border-gray-800"
      />
    </div>
  );
};

export default memo(DatabaseNode);
