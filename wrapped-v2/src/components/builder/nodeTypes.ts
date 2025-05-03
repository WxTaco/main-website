import CommandNode from './CommandNode';
import EventNode from './EventNode';
import UtilityNode from './UtilityNode';

const nodeTypes = {
  command: CommandNode,
  messageCommand: CommandNode,
  readyEvent: EventNode,
  messageEvent: EventNode,
  interactionEvent: EventNode,
  database: UtilityNode,
  api: UtilityNode,
  embed: UtilityNode,
};

export default nodeTypes;
