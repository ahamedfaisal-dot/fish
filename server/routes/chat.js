import express from 'express';

const router = express.Router();

// Chat with AI assistant
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Try to use Gemini AI if API key is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a fishing assistant for Tamil Nadu coastal waters in India. Help with fishing advice, weather conditions, and zone recommendations for the Bay of Bengal. 

Context: ${JSON.stringify(context)}

User question: ${message}

Provide helpful, specific advice for fishing in Tamil Nadu waters.`
              }]
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiResponse) {
            return res.json({ response: aiResponse });
          }
        }
      } catch (geminiError) {
        console.log('Gemini API error, using fallback response');
      }
    }
    
    // Fallback response system
    let response = "I'm your fishing assistant for Tamil Nadu waters. ";
    
    if (message.toLowerCase().includes('weather')) {
      response += "Current weather conditions look good for fishing. Wind speeds are moderate and visibility is clear. The Bay of Bengal is showing favorable conditions for coastal fishing.";
    } else if (message.toLowerCase().includes('fish') || message.toLowerCase().includes('species')) {
      response += "For Tamil Nadu waters, I recommend targeting Seer Fish, Red Snapper, and Pomfret. The best fishing times are early morning (5-8 AM) and late evening (6-9 PM). Seer fish are particularly active during winter months.";
    } else if (message.toLowerCase().includes('zone') || message.toLowerCase().includes('location')) {
      response += "The Chennai deep waters and Rameswaram areas are showing high fishing activity. Check the map for current zone predictions. Mamallapuram reef area is also productive for bottom fishing.";
    } else if (message.toLowerCase().includes('bait')) {
      response += "For Tamil Nadu fishing, try using sardines, prawns, or squid as bait. Live bait works best for larger predatory fish like Seer Fish and Tuna. For bottom fishing, use prawns or small crabs.";
    } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('when')) {
      response += "Best fishing times in Tamil Nadu are during high tide, early morning (5-8 AM), and evening (6-9 PM). Avoid midday when the sun is strongest. Winter months (November-February) are ideal for deep sea fishing.";
    } else {
      response += "I can help you with fishing advice, weather conditions, species information, and zone recommendations for Tamil Nadu coastal waters. What would you like to know about fishing in the Bay of Bengal?";
    }
    
    // Add context-specific information
    if (context?.weather) {
      response += ` Current water temperature is ${Math.round(context.weather.waterTemp)}°C with ${Math.round(context.weather.windSpeed)} km/h winds from the ${context.weather.windDirection}.`;
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