import express from 'express';
import { db } from '../index.js';
import { fishingZones, catchReports } from '../../shared/schema.js';

const router = express.Router();

// Generate heatmap data
router.post('/', async (req, res) => {
  try {
    const { bounds, species, timeRange = 24, resolution = 0.005 } = req.body;
    
    if (!bounds) {
      return res.status(400).json({ error: 'Bounds are required' });
    }
    
    // Get fishing zones within bounds
    const zones = await db.select().from(fishingZones);
    const filteredZones = zones.filter(zone => 
      zone.latitude >= bounds.south && 
      zone.latitude <= bounds.north &&
      zone.longitude >= bounds.west && 
      zone.longitude <= bounds.east
    );
    
    // Get recent catch reports for additional data
    const recentCatches = await db.select().from(catchReports);
    
    // Generate grid points
    const points = [];
    const latStep = resolution;
    const lngStep = resolution;
    
    for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
      for (let lng = bounds.west; lng <= bounds.east; lng += lngStep) {
        let probability = 0;
        let weight = 1;
        
        // Calculate probability based on nearby zones
        for (const zone of filteredZones) {
          const distance = calculateDistance(lat, lng, zone.latitude, zone.longitude);
          const influence = Math.max(0, 1 - (distance / 5)); // 5km influence radius
          probability += zone.confidence * influence;
        }
        
        // Add influence from recent catches
        for (const catchReport of recentCatches) {
          const distance = calculateDistance(lat, lng, catchReport.latitude, catchReport.longitude);
          const influence = Math.max(0, 1 - (distance / 2)); // 2km influence radius
          const recency = Math.max(0, 1 - (Date.now() - new Date(catchReport.timestamp).getTime()) / (timeRange * 60 * 60 * 1000));
          probability += (catchReport.quantity / 10) * influence * recency;
        }
        
        // Normalize probability
        probability = Math.min(1, probability);
        
        // Only include points with meaningful probability
        if (probability > 0.1) {
          points.push({
            lat,
            lng,
            probability,
            weight: weight * probability
          });
        }
      }
    }
    
    // Calculate coverage statistics
    const probabilities = points.map(p => p.probability);
    const coverage = {
      minProbability: Math.min(...probabilities),
      maxProbability: Math.max(...probabilities),
      averageProbability: probabilities.reduce((sum, p) => sum + p, 0) / probabilities.length
    };
    
    res.json({
      points,
      timestamp: new Date().toISOString(),
      resolution,
      coverage
    });
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({ error: 'Failed to generate heatmap' });
  }
});

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;