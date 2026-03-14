import express from "express";
import app from "./src/services/app.js";
import connectDB from "./src/services/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* serve React static files */
app.use(express.static(path.join(__dirname, "../frontend/dist")));

/* React fallback route */
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

/* connect database */
connectDB();

/* required for Fly.io */
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});