import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ConditionNodeProps {
  data: {
    id: string;
    label: string;
    description?: string;
    type?: string;
    comparisons?: string[]; // IDs of comparison nodes
    logicalOperator?: 'AND' | 'OR';
    onAddComparison?: (conditionId: string) => void;
  };
  selected: boolean;
}

const ConditionNode = ({ data, selected }: ConditionNodeProps) => {
  const handleAddComparison = () => {
    if (data.onAddComparison && data.id) {
      data.onAddComparison(data.id);
    }
  };

  return (
    <div className={`p-3 rounded-md border ${
      selected
        ? 'bg-gray-800 border-purple-500 shadow-lg shadow-purple-500/20'
        : 'bg-gray-900 border-gray-700'
    } transition-all duration-200 min-w-[180px]`}>
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
        <div className="font-bold text-white">{data.label}</div>
      </div>

      {data.description && (
        <div className="text-xs text-gray-300 mb-2">{data.description}</div>
      )}

      {/* Comparison count */}
      <div className="text-xs text-gray-300 mb-2">
        {data.comparisons && data.comparisons.length > 0 ? (
          <span>
            {data.comparisons.length} comparison{data.comparisons.length !== 1 ? 's' : ''}
            {data.comparisons.length > 1 && (
              <span className="ml-1 text-purple-300">({data.logicalOperator || 'AND'})</span>
            )}
          </span>
        ) : (
          <span className="text-gray-400 italic">No comparisons yet</span>
        )}
      </div>

      {/* Add comparison button */}
      <button
        onClick={handleAddComparison}
        className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-1 px-2 rounded-md transition-colors w-full flex items-center justify-center mb-2"
      >
        <span className="mr-1">+</span> Add Comparison
      </button>

      <div className="text-xs text-gray-400">{data.type || 'Condition'}</div>

      {/* Input handle at the top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-gray-800"
        style={{ top: -1.5 }}
      />

      {/* Output handle at the bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-gray-800"
        style={{ bottom: -1.5 }}
      />
    </div>
  );
};

export default memo(ConditionNode);
