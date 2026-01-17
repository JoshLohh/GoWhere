// Helper function to compute the Haversine distance between two points in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Orders a list of stops using a greedy nearest-neighbor approach
export function orderStopsByNearest({ startLat, startLng, stops }) {
  if (!stops || stops.length === 0) {
    return [];
  }

  const orderedStops = [];
  let remainingStops = [...stops];
  let currentLat = startLat;
  let currentLng = startLng;

  while (remainingStops.length > 0) {
    let nearestStop = null;
    let minDistance = Infinity;
    let nearestStopIndex = -1;

    remainingStops.forEach((stop, index) => {
      const distance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStop = stop;
        nearestStopIndex = index;
      }
    });

    if (nearestStop) {
      orderedStops.push(nearestStop);
      currentLat = nearestStop.lat;
      currentLng = nearestStop.lng;
      remainingStops.splice(nearestStopIndex, 1);
    }
  }

  return orderedStops;
}
