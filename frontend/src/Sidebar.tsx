import React from 'react';

interface SidebarProps {
  onSave: () => void;
  onLoad: () => void;
  onRun: () => void;
}

export default function Sidebar({ onSave, onLoad, onRun }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: '250px', padding: '20px', backgroundColor: '#f8f9fa', borderRight: '1px solid #ddd', height: '100vh' }}>
      <h3 style={{ marginTop: 0, fontFamily: 'sans-serif' }}>AI Agents</h3>
      
      <div style={draggableStyle} onDragStart={(e) => onDragStart(e, 'default', '🔍 Scraper')} draggable>🔍 Scraper Bot</div>
      <div style={draggableStyle} onDragStart={(e) => onDragStart(e, 'default', '🧠 Analyst')} draggable>🧠 Analyst Bot</div>
      <div style={draggableStyle} onDragStart={(e) => onDragStart(e, 'default', '✍️ Writer')} draggable>✍️ Writer Bot</div>

      <hr style={{ margin: '20px 0' }} />

      <button onClick={onSave} style={{ ...buttonStyle, backgroundColor: '#007bff' }}>
        Save Workflow
      </button>

      <button onClick={onLoad} style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '10px' }}>
        Load Last Workflow
      </button>

      {/* Added the Run Button here */}
      <button onClick={onRun} style={{ ...buttonStyle, backgroundColor: '#dc3545', marginTop: '10px' }}>
        Run Workflow
      </button>
    </aside>
  );
}

const draggableStyle: React.CSSProperties = {
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #007bff',
  borderRadius: '4px',
  cursor: 'grab',
  backgroundColor: '#ffffff',
  fontFamily: 'sans-serif',
  fontSize: '14px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const buttonStyle: React.CSSProperties = {
  padding: '10px',
  width: '100%',
  cursor: 'pointer',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 'bold'
};