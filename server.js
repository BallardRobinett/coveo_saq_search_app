"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Serve static files from the dist directory
app.use(express_1.default.static('dist'));
// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'dist', 'index.html'));
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`Static files being served from: ${path_1.default.join(process.cwd(), 'dist')}`);
});
