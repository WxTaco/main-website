import { memo } from 'react';
import { getBezierPath } from 'reactflow';
import './CustomEdge.css';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: string;
  targetPosition?: string;
  style?: React.CSSProperties;
  data?: any;
  markerEnd?: string;
}

interface EdgeRemoveButtonProps {
  x: number;
  y: number;
  onClick: () => void;
}

const EdgeRemoveButton = ({ x, y, onClick }: EdgeRemoveButtonProps) => {
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
        stroke="#FF0072"
        strokeWidth={2}
        fill="#ffffff"
      />
      <path
        className="react-flow__edge-button-path"
        d="M -4 -4 L 4 4 M -4 4 L 4 -4"
        stroke="#FF0072"
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

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeRemoveButton x={labelX} y={labelY} onClick={onEdgeClick} />
    </>
  );
};

export default memo(CustomEdge);
