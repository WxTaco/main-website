import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CommandNodeProps {
  data: {
    label: string;
    description?: string;
    type?: string;
    commandName?: string;
    options?: Array<{
      name: string;
      description: string;
      type: string;
      required: boolean;
    }>;
    responseType?: 'text' | 'embed' | 'both';
    responseText?: string;
    ephemeral?: boolean;
    deferReply?: boolean;
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

      {data.commandName && (
        <div className="text-xs text-gray-300 mb-1">/{data.commandName}</div>
      )}

      {data.options && data.options.length > 0 && (
        <div className="text-xs text-gray-400 mb-1">
          {data.options.length} option{data.options.length !== 1 ? 's' : ''}
        </div>
      )}

      {data.responseType && (
        <div className="text-xs text-gray-400 mb-1">
          Response: {data.responseType === 'text' ? 'Text' : data.responseType === 'embed' ? 'Embed' : 'Text & Embed'}
        </div>
      )}

      {data.ephemeral && (
        <div className="text-xs text-gray-400 mb-1">Ephemeral</div>
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
