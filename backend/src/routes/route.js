import express from "express";
import { getOptimizedRoute } from "../services/routeService.js";

const router = express.Router();

/**
 * POST /api/route
 * Body: { places: [{ lat: number, lng: number }, ...] }
 */
router.post("/", async (req, res) => {
  try {
    const { places } = req.body;

    if (!places || !Array.isArray(places) || places.length < 2) {
      return res.status(400).json({ error: "At least two places are required in the request body." });
    }

    const optimizedRoute = await getOptimizedRoute(places);
    res.json(optimizedRoute);

  } catch (err) {
    console.error("Error optimizing route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
