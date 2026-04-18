import express from "express";
import dotenv from "dotenv";
import app from "./src/services/app.js";
import connectDB from "./src/services/db.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();


connectDB();


const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});