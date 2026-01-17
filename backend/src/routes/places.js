import express from "express";
import { getSuggestedStops } from "../services/placesService.js";

const router = express.Router();

/**
 * GET /api/places
 * Query params:
 * - vibe (string)
 * - location (string)
 * - stops (number, optional)
 * - time (hours, optional)
 */
router.get("/", async (req, res) => {
  try {
    const { vibe, location, stops, time } = req.query;

    if (!location) {
      return res.status(400).json({ error: "location is a required query parameter." });
    }

    const suggestedStops = await getSuggestedStops({
      vibe,
      location,
      stops: Number(stops) || 10, // Default to 10 if not provided
      time: Number(time),
    });

    res.json({
      vibe: vibe || "chill",
      stops: suggestedStops,
    });
  } catch (err) {
    console.error("Error in /api/places route:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
