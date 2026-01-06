import { Node } from 'reactflow';
import { PatentNode } from '../types/citation';

interface LayoutOptions {
  centerX?: number;
  centerY?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
}

/**
 * Applies hierarchical left-to-right layout
 * Root node in center, backward citations on left, forward citations on right
 */
export function applyHierarchicalLayout(
  nodes: PatentNode[],
  rootPatentId: string,
  options: LayoutOptions = {}
): Node[] {
  const {
    centerX = 500,
    centerY = 300,
    horizontalSpacing = 400,
    verticalSpacing = 80,
  } = options;

  const layoutedNodes: Node[] = [];
  
  // Find root node
  const rootNode = nodes.find(n => n.patentId === rootPatentId);
  if (!rootNode) return [];

  // Separate nodes by depth
  const backwardNodes = nodes.filter(n => n.depth === 1 && n.patentId !== rootPatentId);
  const forwardNodes = nodes.filter(n => n.depth === -1 && n.patentId !== rootPatentId);

  // Position root node
  layoutedNodes.push(createFlowNode(rootNode, centerX, centerY, true));

  // Position backward citations (left side)
  const backwardCount = backwardNodes.length;
  const backwardStartY = centerY - ((backwardCount - 1) * verticalSpacing) / 2;
  
  backwardNodes.forEach((node, index) => {
    const y = backwardCount === 1 ? centerY : backwardStartY + index * verticalSpacing;
    layoutedNodes.push(createFlowNode(node, centerX - horizontalSpacing, y, false));
  });

  // Position forward citations (right side)
  const forwardCount = forwardNodes.length;
  const forwardStartY = centerY - ((forwardCount - 1) * verticalSpacing) / 2;
  
  forwardNodes.forEach((node, index) => {
    const y = forwardCount === 1 ? centerY : forwardStartY + index * verticalSpacing;
    layoutedNodes.push(createFlowNode(node, centerX + horizontalSpacing, y, false));
  });

  return layoutedNodes;
}

/**
 * Creates a React Flow node from PatentNode data
 */
function createFlowNode(node: PatentNode, x: number, y: number, isRoot: boolean): Node {
  return {
    id: node.patentId,
    type: 'customPatentNode',
    data: {
      ...node,
      label: node.patentId,
      isRoot,
    },
    position: { x, y },
    draggable: true,
    selectable: true,
  };
}

/**
 * Applies radial layout (circular arrangement)
 * Useful for when you want to show all citations in a circle
 */
export function applyRadialLayout(
  nodes: PatentNode[],
  rootPatentId: string,
  options: LayoutOptions = {}
): Node[] {
  const {
    centerX = 500,
    centerY = 300,
  } = options;

  const layoutedNodes: Node[] = [];
  const rootNode = nodes.find(n => n.patentId === rootPatentId);
  if (!rootNode) return [];

  const otherNodes = nodes.filter(n => n.patentId !== rootPatentId);
  const radius = 250;
  const angleStep = (2 * Math.PI) / otherNodes.length;

  // Position root in center
  layoutedNodes.push(createFlowNode(rootNode, centerX, centerY, true));

  // Position others in circle
  otherNodes.forEach((node, index) => {
    const angle = index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    layoutedNodes.push(createFlowNode(node, x, y, false));
  });

  return layoutedNodes;
}

/**
 * Calculates optimal viewport to fit all nodes
 */
export function calculateViewport(nodes: Node[]) {
  if (nodes.length === 0) {
    return { x: 0, y: 0, zoom: 1 };
  }

  const xs = nodes.map(n => n.position.x);
  const ys = nodes.map(n => n.position.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX + 200; // padding
  const height = maxY - minY + 200;

  return {
    x: minX - 100,
    y: minY - 100,
    zoom: Math.min(1, Math.min(1000 / width, 600 / height)),
  };
}
