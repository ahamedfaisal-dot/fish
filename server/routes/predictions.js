import express from 'express';

const router = express.Router();

// Mock fishing zones for predictions
const mockZones = [
  {
    id: 1,
    name: "Chennai Deep Waters",
    latitude: 13.0827,
    longitude: 80.3707,
    radius: 5000,
    confidence: 0.85,
    species: ["Seer Fish", "Tuna", "Sailfish"],
    depth: 80
  },
  {
    id: 2,
    name: "Mamallapuram Reef",
    latitude: 12.6167,
    longitude: 80.2425,
    radius: 3000,
    confidence: 0.78,
    species: ["Red Snapper", "Grouper", "Pomfret"],
    depth: 45
  },
  {
    id: 3,
    name: "Rameswaram Banks",
    latitude: 9.2876,
    longitude: 79.3629,
    radius: 8000,
    confidence: 0.92,
    species: ["Seer Fish", "Red Snapper", "Kingfish"],
    depth: 60
  },
  {
    id: 4,
    name: "Tuticorin Offshore",
    latitude: 8.8047,
    longitude: 78.1848,
    radius: 6000,
    confidence: 0.73,
    species: ["Pomfret", "Mackerel", "Flying Fish"],
    depth: 35
  },
  {
    id: 5,
    name: "Kanyakumari Deep Sea",
    latitude: 8.0883,
    longitude: 77.4885,
    radius: 7000,
    confidence: 0.88,
    species: ["Tuna", "Marlin", "Sailfish"],
    depth: 120
  }
];

// Get fishing predictions
router.post('/', async (req, res) => {
  try {
    const { species, timeRange, confidence, bounds } = req.body;
    
    let zones = [...mockZones];
    
    // Filter by bounds if provided
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