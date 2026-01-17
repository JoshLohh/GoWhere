import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import placesRouter from "./routes/places.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("GoWhere backend running ✅");
});

// Routes
app.use("/api/places", placesRouter);

// Server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
