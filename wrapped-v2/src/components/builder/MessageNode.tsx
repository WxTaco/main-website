import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { EmbedData } from './EmbedBuilder';

interface MessageNodeProps {
  data: {
    label: string;
    description?: string;
    type?: string;
    messageContent?: string;
    useEmbed?: boolean;
    embedData?: EmbedData;
    replyToUser?: boolean;
    ephemeral?: boolean;
  };
  selected: boolean;
}

const MessageNode = ({ data, selected }: MessageNodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${
      selected 
        ? 'bg-gray-800 border-wrapped-blue shadow-lg shadow-wrapped-blue/20' 
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[180px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-wrapped-blue mr-2"></div>
        <div className="font-bold text-white">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-xs text-gray-300 mb-2">{data.description}</div>
      )}
      
      {data.messageContent && (
        <div className="text-xs text-gray-300 mb-1 truncate max-w-[160px]">
          "{data.messageContent.substring(0, 30)}{data.messageContent.length > 30 ? '...' : ''}"
        </div>
      )}
      
      {data.useEmbed && (
        <div className="text-xs text-gray-400 mb-1">
          Uses embed
        </div>
      )}
      
      {data.ephemeral && (
        <div className="text-xs text-gray-400 mb-1">Ephemeral</div>
      )}
      
      <div className="text-xs text-gray-400">{data.type || 'Message'}</div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-wrapped-blue border-2 border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-wrapped-blue border-2 border-gray-800"
      />
    </div>
  );
};

export default memo(MessageNode);
