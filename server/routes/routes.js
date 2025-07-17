import express from 'express';
import { db } from '../index.js';
import { routes } from '../../shared/schema.js';

const router = express.Router();

// Optimize fishing route
router.post('/optimize', async (req, res) => {
  try {
    const { startPoint, targetZones, preferences = {} } = req.body;
    
    if (!startPoint || !targetZones || targetZones.length === 0) {
      return res.status(400).json({ error: 'Start point and target zones are required' });
    }
    
    const {
      maxDistance = 50,
      fuelPrice = 3.5,
      boatSpeed = 25,
      fuelConsumption = 12
    } = preferences;
    
    // Simple route optimization - in production, use proper routing algorithms
    const waypoints = [startPoint];
    let totalDistance = 0;
    let currentPoint = startPoint;
    
    // Sort zones by distance from current point and confidence
    const sortedZones = targetZones
      .map(zone => ({
        ...zone,
        distance: calculateDistance(currentPoint.lat, currentPoint.lng, zone.latitude, zone.longitude)
      }))
      .sort((a, b) => {
        // Balance distance and confidence
        const scoreA = a.confidence * 0.7 - (a.distance / maxDistance) * 0.3;
        const scoreB = b.confidence * 0.7 - (b.distance / maxDistance) * 0.3;
        return scoreB - scoreA;
      })
      .slice(0, 3); // Limit to 3 zones
    
    // Add zones to route
    for (const zone of sortedZones) {
      const distance = calculateDistance(currentPoint.lat, currentPoint.lng, zone.latitude, zone.longitude);
      if (totalDistance + distance <= maxDistance) {
        waypoints.push({
          lat: zone.latitude,
          lng: zone.longitude,
          zoneId: zone.id,
          name: zone.name
        });
        totalDistance += distance;
        currentPoint = { lat: zone.latitude, lng: zone.longitude };
      }
    }
    
    // Calculate estimates
    const estimatedTime = (totalDistance / boatSpeed) * 60; // minutes
    const estimatedFuel = (estimatedTime / 60) * fuelConsumption * fuelPrice; // dollars
    
    const optimizedRoute = {
      waypoints,
      totalDistance: Math.round(totalDistance * 10) / 10,
      estimatedTime: Math.round(estimatedTime),
      estimatedFuel: Math.round(estimatedFuel * 100) / 100,
      efficiency: waypoints.length > 1 ? (waypoints.length - 1) / totalDistance : 0
    };
    
    res.json(optimizedRoute);
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;