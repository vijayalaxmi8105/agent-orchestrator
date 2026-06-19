import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/agent-orchestrator')
  .then(() => console.log("Connected to MongoDB: agent-orchestrator"))
  .catch((err) => console.error("Could not connect:", err));

// 2. Simple Schema for your Workflow
const WorkflowSchema = new mongoose.Schema({
  name: String,
  nodes: Array,
  edges: Array,
});

const Workflow = mongoose.model('Workflow', WorkflowSchema);

// 3. API Route to Save Workflow
app.post('/api/save', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const newWorkflow = new Workflow({ name, nodes, edges });
    await newWorkflow.save();
    res.json({ message: "Workflow saved successfully!" });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Failed to save workflow" });
  }
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`--- Server running on http://localhost:${PORT} ---`);
}).on('error', (err) => {
  console.error("SERVER ERROR:", err);
});

// Add this GET route to fetch the latest workflow
app.get('/api/load', async (req, res) => {
  try {
    // Finds the most recent workflow saved
    const latestWorkflow = await Workflow.findOne().sort({ _id: -1 });
    if (!latestWorkflow) {
      return res.status(404).json({ message: "No workflow found" });
    }
    res.json(latestWorkflow);
  } catch (error) {
    res.status(500).json({ message: "Failed to load workflow" });
  }
});