import express from "express";
import { getSuggestedStops } from "../services/placesService.js";

const router = express.Router();

/**
 * GET /api/places
 * Query params:
 * - vibe (string)
 * - lat (number)
 * - lng (number)
 * - time (hours, optional)
 */
router.get("/", async (req, res) => {
  try {
    const { vibe, lat, lng, time } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const stops = await getSuggestedStops({
      vibe,
      lat: Number(lat),
      lng: Number(lng),
      time: Number(time),
    });

    res.json({
      vibe: vibe || "chill",
      stops,
    });
  } catch (err) {
    console.error("Error generating places:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
