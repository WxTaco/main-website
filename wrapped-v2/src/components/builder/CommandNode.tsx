import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CommandNodeProps {
  data: {
    label: string;
    description?: string;
    type?: string;
  };
  selected: boolean;
}

const CommandNode = ({ data, selected }: CommandNodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${
      selected 
        ? 'bg-gray-800 border-wrapped-pink shadow-lg shadow-wrapped-pink/20' 
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[180px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-wrapped-pink mr-2"></div>
        <div className="font-bold text-white">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-300 mb-2">{data.description}</div>
      )}
      
      <div className="text-xs text-gray-400">{data.type || 'Command'}</div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-wrapped-pink border-2 border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-wrapped-pink border-2 border-gray-800"
      />
    </div>
  );
};

export default memo(CommandNode);
