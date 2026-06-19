"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 1. Database Connection
mongoose_1.default.connect('mongodb://127.0.0.1:27017/agent-orchestrator')
    .then(() => console.log("Connected to MongoDB: agent-orchestrator"))
    .catch((err) => console.error("Could not connect:", err));
// 2. Simple Schema for your Workflow
const WorkflowSchema = new mongoose_1.default.Schema({
    name: String,
    nodes: Array,
    edges: Array,
});
const Workflow = mongoose_1.default.model('Workflow', WorkflowSchema);
// 3. API Route to Save Workflow
app.post('/api/save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, nodes, edges } = req.body;
        const newWorkflow = new Workflow({ name, nodes, edges });
        yield newWorkflow.save();
        res.json({ message: "Workflow saved successfully!" });
    }
    catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ message: "Failed to save workflow" });
    }
}));
// 4. Start Server
app.listen(PORT, () => {
    console.log(`--- Server running on http://localhost:${PORT} ---`);
}).on('error', (err) => {
    console.error("SERVER ERROR:", err);
});
