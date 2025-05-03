import { memo } from 'react';
import { getBezierPath, Position } from 'reactflow';
import './CustomEdge.css';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: React.CSSProperties;
  data?: any;
  markerEnd?: string;
}

interface EdgeRemoveButtonProps {
  x: number;
  y: number;
  onClick: () => void;
  color?: string;
}

const EdgeRemoveButton = ({ x, y, onClick, color = "#FF0072" }: EdgeRemoveButtonProps) => {
  return (
    <g
      transform={`translate(${x - 10} ${y - 10})`}
      className="react-flow__edge-button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <circle
        className="react-flow__edge-button-circle"
        r={8}
        stroke={color}
        strokeWidth={2}
        fill="#ffffff"
      />
      <path
        className="react-flow__edge-button-path"
        d="M -4 -4 L 4 4 M -4 4 L 4 -4"
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    if (data && data.onDelete) {
      data.onDelete(id);
    }
  };

  // Determine if this is a condition edge and what type
  const isConditionEdge = data && data.conditionResult;
  const edgeColor = isConditionEdge
    ? data.conditionResult === 'true'
      ? '#10b981' // Green for true
      : '#ef4444' // Red for false
    : '#FF0072'; // Default pink

  const edgeStyles = {
    ...style,
    stroke: edgeColor,
    strokeWidth: 2,
  };

  return (
    <>
      <path
        id={id}
        style={edgeStyles}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* No labels on the edges */}
      <EdgeRemoveButton x={labelX} y={labelY} onClick={onEdgeClick} color={edgeColor} />
    </>
  );
};

export default memo(CustomEdge);
