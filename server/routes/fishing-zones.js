import express from 'express';

const router = express.Router();

// Mock data for Tamil Nadu fishing zones
const mockZones = [
  {
    id: 1,
    name: "Chennai Deep Waters",
    latitude: 13.0827,
    longitude: 80.3707,
    radius: 5000,
    confidence: 0.85,
    species: ["Seer Fish", "Tuna", "Sailfish"],
    depth: 80,
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: "Mamallapuram Reef",
    latitude: 12.6167,
    longitude: 80.2425,
    radius: 3000,
    confidence: 0.78,
    species: ["Red Snapper", "Grouper", "Pomfret"],
    depth: 45,
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: "Rameswaram Banks",
    latitude: 9.2876,
    longitude: 79.3629,
    radius: 8000,
    confidence: 0.92,
    species: ["Seer Fish", "Red Snapper", "Kingfish"],
    depth: 60,
    lastUpdated: new Date()
  },
  {
    id: 4,
    name: "Tuticorin Offshore",
    latitude: 8.8047,
    longitude: 78.1848,
    radius: 6000,
    confidence: 0.73,
    species: ["Pomfret", "Mackerel", "Flying Fish"],
    depth: 35,
    lastUpdated: new Date()
  },
  {
    id: 5,
    name: "Kanyakumari Deep Sea",
    latitude: 8.0883,
    longitude: 77.4885,
    radius: 7000,
    confidence: 0.88,
    species: ["Tuna", "Marlin", "Sailfish"],
    depth: 120,
    lastUpdated: new Date()
  }
];

// Get all fishing zones
router.get('/', async (req, res) => {
  try {
    // Try database first, fallback to mock data
    try {
      const { db } = await import('../index.js');
      if (db) {
        const { fishingZones } = await import('../../shared/schema.js');
        const zones = await db.select().from(fishingZones);
        if (zones.length > 0) {
          return res.json(zones);
        }
      }
    } catch (dbError) {
      console.log('Database not available, using mock data');
    }
    
    res.json(mockZones);
  } catch (error) {
    console.error('Error fetching fishing zones:', error);
    res.json(mockZones); // Always return mock data as fallback
  }
});

// Create new fishing zone
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, radius, confidence, species, depth } = req.body;
    
    if (!name || !latitude || !longitude || !radius || confidence === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newZone = {
      id: mockZones.length + 1,
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
      confidence: parseFloat(confidence),
      species: species || [],
      depth: depth ? parseFloat(depth) : null,
      lastUpdated: new Date()
    };

    mockZones.push(newZone);
    res.status(201).json(newZone);
  } catch (error) {
    console.error('Error creating fishing zone:', error);
    res.status(500).json({ error: 'Failed to create fishing zone' });
  }
});

export default router;