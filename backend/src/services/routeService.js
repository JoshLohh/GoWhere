import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

/**
 * Optimizes a route between a list of places using Google Directions API.
 * @param {Array<Object>} places - An array of place objects, each with lat and lng.
 * @returns {Object} - The optimized route details from Google Directions API.
 */
export async function getOptimizedRoute(places) {
  if (!places || places.length < 2) {
    throw new Error("At least two places are required to optimize a route.");
  }

  const origin = `${places[0].lat},${places[0].lng}`;
  const destination = `${places[places.length - 1].lat},${places[places.length - 1].lng}`;

  // Revert to a simple array of strings for waypoints, which the client library expects.
  const waypoints = places.slice(1, -1).map(p => `${p.lat},${p.lng}`);

  try {
    const response = await client.directions({
      params: {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        mode: "walking",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 5000, // Keep increased timeout
    });

    if (response.data.status !== "OK") {
      throw new Error(`Google Directions API error: ${response.data.status} - ${response.data.error_message || 'No error message provided.'}`);
    }

    return response.data;

  } catch (error) {
    console.error("Full error object during route optimization:", error);
    throw new Error("Failed to optimize route.");
  }
}