import { useState, useRef, useCallback } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Background, 
  Controls,
} from 'reactflow';
import type { 
  Connection, 
  EdgeChange, 
  NodeChange, 
  Node, 
  Edge, 
  ReactFlowInstance 
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';

let id = 0;
const getId = () => `bot_${id++}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = { id: getId(), type, position, data: { label } };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const saveWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "My AI Pipeline", nodes, edges }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) { console.error("Save failed:", error); }
  };

  const loadWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/load');
      const data = await response.json();
      if (data && data.nodes) {
        setNodes(data.nodes);
        setEdges(data.edges || []);
        alert("Workflow loaded successfully!");
      }
    } catch (error) { console.error("Load failed:", error); }
  };

  const runWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      alert("Workflow Output: " + JSON.stringify(data.results));
    } catch (error) {
      console.error("Execution failed:", error);
      alert("Failed to run workflow. Ensure server is connected.");
    }
  };

  return (
    <div className="dndflow" style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <Sidebar onSave={saveWorkflow} onLoad={loadWorkflow} onRun={runWorkflow} />
      <div className="reactflow-wrapper" style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}