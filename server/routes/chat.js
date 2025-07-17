import express from 'express';

const router = express.Router();

// Chat with AI assistant
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Mock response for now - in production, integrate with Gemini AI
    let response = "I'm your fishing assistant for Tamil Nadu waters. ";
    
    if (message.toLowerCase().includes('weather')) {
      response += "Current weather conditions look good for fishing. Wind speeds are moderate and visibility is clear.";
    } else if (message.toLowerCase().includes('fish') || message.toLowerCase().includes('species')) {
      response += "For Tamil Nadu waters, I recommend targeting Seer Fish, Red Snapper, and Pomfret. The best fishing times are early morning and late evening.";
    } else if (message.toLowerCase().includes('zone') || message.toLowerCase().includes('location')) {
      response += "The Chennai deep waters and Rameswaram areas are showing high fishing activity. Check the map for current zone predictions.";
    } else if (message.toLowerCase().includes('bait')) {
      response += "For Tamil Nadu fishing, try using sardines, prawns, or squid as bait. Live bait works best for larger predatory fish.";
    } else {
      response += "I can help you with fishing advice, weather conditions, species information, and zone recommendations for Tamil Nadu coastal waters. What would you like to know?";
    }
    
    // Add context-specific information
    if (context?.weather) {
      response += ` Current water temperature is ${context.weather.waterTemp}°C with ${context.weather.windSpeed} km/h winds.`;
    }
    
    if (context?.zones && context.zones.length > 0) {
      response += ` I see ${context.zones.length} fishing zones are currently active with good confidence levels.`;
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;