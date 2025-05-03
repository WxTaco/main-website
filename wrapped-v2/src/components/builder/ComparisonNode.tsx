import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ComparisonNodeProps {
  data: {
    label?: string;
    leftValue?: string;
    operator?: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'startsWith' | 'endsWith';
    rightValue?: string;
    parentId?: string;
  };
  selected: boolean;
}

const ComparisonNode = ({ data, selected }: ComparisonNodeProps) => {
  // Get operator display text
  const getOperatorDisplay = (op?: string) => {
    switch (op) {
      case '==': return '=';
      case '!=': return '≠';
      case '>': return '>';
      case '<': return '<';
      case '>=': return '≥';
      case '<=': return '≤';
      case 'includes': return 'includes';
      case 'startsWith': return 'starts with';
      case 'endsWith': return 'ends with';
      default: return '=';
    }
  };

  return (
    <div className={`p-2 rounded-md border ${
      selected
        ? 'bg-gray-800 border-purple-300 shadow-lg shadow-purple-300/20'
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[140px] max-w-[200px]`}>
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-300 truncate max-w-[70px]" title={data.leftValue}>
          {data.leftValue || 'value1'}
        </div>
        <div className="text-purple-300 mx-1 font-medium">
          {getOperatorDisplay(data.operator)}
        </div>
        <div className="text-gray-300 truncate max-w-[70px]" title={data.rightValue}>
          {data.rightValue || 'value2'}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-purple-300 border-2 border-gray-800"
        style={{ top: -1 }}
      />

      {/* Output handles at the bottom */}
      <div className="flex justify-between w-full">
        <div className="relative flex-1 flex justify-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-2 h-2 bg-green-500 border-2 border-gray-800"
            style={{ bottom: -1.5, left: '30%' }}
          />
        </div>
        <div className="relative flex-1 flex justify-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-2 h-2 bg-red-500 border-2 border-gray-800"
            style={{ bottom: -1.5, right: '30%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ComparisonNode);
