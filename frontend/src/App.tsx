import { useState, useCallback } from 'react';

// 1. Import the real components and functions
import ReactFlow, { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Background, 
  Controls 
} from 'reactflow';

// 2. Explicitly import the TypeScript-only definitions using "import type"
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Scraper Bot' } },
  { id: '2', position: { x: 250, y: 200 }, data: { label: 'Analyst Bot' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}