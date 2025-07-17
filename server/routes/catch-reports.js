import express from 'express';

const router = express.Router();

// Mock catch reports data
let mockReports = [
  {
    id: 1,
    userId: 1,
    species: "Seer Fish",
    quantity: 3,
    length: 24,
    weight: 8.5,
    latitude: 13.0827,
    longitude: 80.3707,
    notes: "Good fishing conditions, early morning",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: 2,
    userId: 1,
    species: "Red Snapper",
    quantity: 5,
    length: 18,
    weight: 12.3,
    latitude: 12.6167,
    longitude: 80.2425,
    notes: "Near reef area, used prawns as bait",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 3,
    userId: 1,
    species: "Pomfret",
    quantity: 2,
    length: 22,
    weight: 6.8,
    latitude: 8.8047,
    longitude: 78.1848,
    notes: "Calm waters, good visibility",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  }
];

// Get all catch reports
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, species, userId } = req.query;
    
    let filteredReports = [...mockReports];
    
    if (species) {
      filteredReports = filteredReports.filter(report => report.species === species);
    }
    
    if (userId) {
      filteredReports = filteredReports.filter(report => report.userId === parseInt(userId));
    }
    
    // Sort by timestamp descending
    filteredReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    
    res.json(paginatedReports);
  } catch (error) {
    console.error('Error fetching catch reports:', error);
    res.status(500).json({ error: 'Failed to fetch catch reports' });
  }
});

// Create new catch report
router.post('/', async (req, res) => {
  try {
    const { userId, species, quantity, length, weight, latitude, longitude, notes } = req.body;
    
    if (!species || !quantity || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReport = {
      id: mockReports.length + 1,
      userId: userId || 1,
      species,
      quantity: parseInt(quantity),
      length: length ? parseFloat(length) : null,
      weight: weight ? parseFloat(weight) : null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      notes: notes || null,
      timestamp: new Date()
    };

    mockReports.push(newReport);
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating catch report:', error);
    res.status(500).json({ error: 'Failed to create catch report' });
  }
});

// Get catch statistics
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let reports = mockReports;
    if (userId) {
      reports = reports.filter(report => report.userId === parseInt(userId));
    }
    
    const totalCatches = reports.reduce((sum, report) => sum + report.quantity, 0);
    const totalWeight = reports.reduce((sum, report) => sum + (report.weight || 0), 0);
    const speciesCount = new Set(reports.map(report => report.species)).size;
    
    res.json({
      totalCatches,
      totalWeight: Math.round(totalWeight * 10) / 10,
      speciesCount,
    });
  } catch (error) {
    console.error('Error fetching catch statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;