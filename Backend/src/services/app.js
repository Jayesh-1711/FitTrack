import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import runRoutes from "./routes/runRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://fittrack1-seven.vercel.app","https://fittrack1-git-main-jayesh-1711s-projects.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/run", runRoutes);

export default app;