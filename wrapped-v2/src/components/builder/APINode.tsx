import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface APINodeProps {
  data: {
    label: string;
    description?: string;
    type?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url?: string;
    headers?: Record<string, string>;
    body?: string;
    responseVariable?: string;
  };
  selected: boolean;
}

const APINode = ({ data, selected }: APINodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${
      selected 
        ? 'bg-gray-800 border-wrapped-yellow shadow-lg shadow-wrapped-yellow/20' 
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[180px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-wrapped-yellow mr-2"></div>
        <div className="font-bold text-white">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-300 mb-2">{data.description}</div>
      )}
      
      <div className="text-xs text-gray-300 mb-1">
        {data.method} Request
      </div>
      
      {data.url && (
        <div className="text-xs text-gray-400 mb-1 truncate max-w-[160px]">
          URL: {data.url.substring(0, 25)}{data.url.length > 25 ? '...' : ''}
        </div>
      )}
      
      {data.responseVariable && (
        <div className="text-xs text-gray-400 mb-1">
          Save as: {data.responseVariable}
        </div>
      )}
      
      <div className="text-xs text-gray-400">{data.type || 'API'}</div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-wrapped-yellow border-2 border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-wrapped-yellow border-2 border-gray-800"
      />
    </div>
  );
};

export default memo(APINode);
