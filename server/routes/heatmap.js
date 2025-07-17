import express from 'express';

const router = express.Router();

// Generate heatmap data
router.post('/', async (req, res) => {
  try {
    const { bounds, species, timeRange = 24, resolution = 0.005 } = req.body;
    
    if (!bounds) {
      return res.status(400).json({ error: 'Bounds are required' });
    }
    
    // Generate grid points for heatmap
    const points = [];
    const latStep = resolution;
    const lngStep = resolution;
    
    for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
      for (let lng = bounds.west; lng <= bounds.east; lng += lngStep) {
        // Generate probability based on distance from known fishing zones
        let probability = 0;
        
        // Chennai area - high probability
        if (lat >= 12.8 && lat <= 13.3 && lng >= 80.0 && lng <= 80.5) {
          probability = 0.7 + Math.random() * 0.3;
        }
        // Rameswaram area - very high probability
        else if (lat >= 9.0 && lat <= 9.5 && lng >= 79.0 && lng <= 79.5) {
          probability = 0.8 + Math.random() * 0.2;
        }
        // Kanyakumari area - high probability
        else if (lat >= 8.0 && lat <= 8.5 && lng >= 77.3 && lng <= 77.8) {
          probability = 0.6 + Math.random() * 0.4;
        }
        // Other coastal areas - medium probability
        else if (lng >= 77.0 && lng <= 81.0) {
          probability = 0.3 + Math.random() * 0.4;
        }
        // Deep sea areas - lower probability
        else {
          probability = Math.random() * 0.3;
        }
        
        // Only include points with meaningful probability
        if (probability > 0.1) {
          points.push({
            lat,
            lng,
            probability: Math.min(1, probability),
            weight: probability
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

export default router;