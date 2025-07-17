import express from 'express';
import { db } from '../index.js';
import { fishingZones, catchReports } from '../../shared/schema.js';
import { sql } from 'drizzle-orm';

const router = express.Router();

// Get fishing predictions
router.post('/', async (req, res) => {
  try {
    const { species, timeRange, confidence, bounds } = req.body;
    
    // Get fishing zones within bounds if provided
    let zones = await db.select().from(fishingZones);
    
    if (bounds) {
      zones = zones.filter(zone => 
        zone.latitude >= bounds.south && 
        zone.latitude <= bounds.north &&
        zone.longitude >= bounds.west && 
        zone.longitude <= bounds.east
      );
    }
    
    // Filter by species if specified
    if (species && species !== 'All Species') {
      zones = zones.filter(zone => 
        zone.species && zone.species.includes(species)
      );
    }
    
    // Filter by confidence threshold
    if (confidence) {
      zones = zones.filter(zone => zone.confidence >= confidence);
    }
    
    // Calculate prediction factors
    const factors = {
      historical: 0.8, // Based on catch history
      weather: 0.7,    // Current weather conditions
      seasonal: 0.9,   // Time of year factor
      recent: 0.6      // Recent activity
    };
    
    // Sort zones by confidence
    zones.sort((a, b) => b.confidence - a.confidence);
    
    res.json({
      zones: zones.slice(0, 10), // Return top 10 zones
      confidence: zones.length > 0 ? zones.reduce((sum, z) => sum + z.confidence, 0) / zones.length : 0,
      factors
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({ error: 'Failed to generate predictions' });
  }
});

export default router;