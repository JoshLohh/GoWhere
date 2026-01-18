import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import placesRouter from "./routes/places.js";
import routeRouter from "./routes/route.js";

dotenv.config();

const app = express();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8008";

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("GoWhere backend running ✅");
});

// Routes
app.use("/api/places", placesRouter);
app.use("/api/route", routeRouter);

// Test AI service connection
app.get("/api/ai-test", async (req, res) => {
  try {
    const response = await fetch(AI_SERVICE_URL);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json({
        message: "Successfully connected to AI Service",
        aiServiceResponse: data,
      });
    } else {
      res.status(response.status).json({
        message: "AI Service returned an error",
        aiServiceResponse: data,
      });
    }
  } catch (error) {
    console.error("Error connecting to AI Service:", error);
    res.status(500).json({
      message: "Failed to connect to AI Service",
      error: error.message,
    });
  }
});

// Server
const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
