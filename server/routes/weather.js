import express from 'express';

const router = express.Router();

// Get weather data for a location
router.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Generate realistic weather data for Tamil Nadu coastal waters
    const weatherData = {
      waterTemp: 28 + Math.random() * 4, // 28-32°C
      windSpeed: 15 + Math.random() * 15, // 15-30 km/h
      windDirection: ['NE', 'E', 'SE', 'S'][Math.floor(Math.random() * 4)],
      tideInfo: 'High 2:30 PM',
      visibility: 10 + Math.random() * 5, // 10-15 km
      timestamp: new Date(),
    };

    // Try to fetch real weather data if API key is available
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (response.ok) {
          const data = await response.json();
          weatherData.windSpeed = (data.wind?.speed || 0) * 3.6; // Convert m/s to km/h
          weatherData.windDirection = getWindDirection(data.wind?.deg || 0);
          weatherData.visibility = (data.visibility / 1000) || weatherData.visibility; // Convert m to km
        }
      } catch (error) {
        console.log('OpenWeather API error, using mock data:', error.message);
      }
    }

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export default router;