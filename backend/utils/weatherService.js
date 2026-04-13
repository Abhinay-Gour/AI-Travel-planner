import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather for a location
export const getCurrentWeather = async (location) => {
  try {
    if (!WEATHER_API_KEY) {
      console.log('⚠️ Weather API key not configured');
      return null;
    }

    const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: {
        q: location,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      coordinates: {
        lat: data.coord.lat,
        lng: data.coord.lon
      }
    };

  } catch (error) {
    console.error('❌ Current weather fetch error:', error.response?.data || error.message);
    return null;
  }
};

// Get weather forecast for trip dates
export const getWeatherData = async (location, startDate, endDate) => {
  try {
    if (!WEATHER_API_KEY) {
      console.log('⚠️ Weather API key not configured, returning mock data');
      return generateMockWeatherData(startDate, endDate);
    }

    // First get coordinates for the location
    const geoResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: {
        q: location,
        appid: WEATHER_API_KEY
      }
    });

    const { lat, lon } = geoResponse.data.coord;

    // Get 5-day forecast (free tier limitation)
    const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const forecastData = forecastResponse.data.list;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const weatherData = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Find forecast data for this date (or closest available)
      const dayForecast = forecastData.find(item => {
        const forecastDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return forecastDate === dateStr;
      }) || forecastData[0]; // Fallback to first available

      if (dayForecast) {
        weatherData.push({
          date: dateStr,
          temperature: `${Math.round(dayForecast.main.temp)}°C`,
          condition: dayForecast.weather[0].main,
          description: dayForecast.weather[0].description,
          icon: dayForecast.weather[0].icon,
          humidity: dayForecast.main.humidity,
          windSpeed: dayForecast.wind.speed
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weatherData;

  } catch (error) {
    console.error('❌ Weather forecast error:', error.response?.data || error.message);
    return generateMockWeatherData(startDate, endDate);
  }
};

// Generate mock weather data when API is not available
const generateMockWeatherData = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weatherData = [];
  const currentDate = new Date(start);

  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Sunny'];
  const descriptions = ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'sunny'];
  const icons = ['01d', '02d', '03d', '10d', '01d'];

  while (currentDate <= end) {
    const randomIndex = Math.floor(Math.random() * conditions.length);
    const baseTemp = 20 + Math.random() * 15; // 20-35°C range
    
    weatherData.push({
      date: currentDate.toISOString().split('T')[0],
      temperature: `${Math.round(baseTemp)}°C`,
      condition: conditions[randomIndex],
      description: descriptions[randomIndex],
      icon: icons[randomIndex],
      humidity: Math.round(40 + Math.random() * 40), // 40-80%
      windSpeed: Math.round(5 + Math.random() * 10) // 5-15 km/h
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weatherData;
};

// Get weather recommendations for travel
export const getWeatherRecommendations = async (location, startDate, endDate) => {
  try {
    const weatherData = await getWeatherData(location, startDate, endDate);
    
    if (!weatherData || weatherData.length === 0) {
      return {
        recommendations: ['Check local weather before traveling'],
        packingTips: ['Pack weather-appropriate clothing']
      };
    }

    const recommendations = [];
    const packingTips = [];
    
    // Analyze weather patterns
    const temps = weatherData.map(day => parseInt(day.temperature));
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    const rainyDays = weatherData.filter(day => day.condition.toLowerCase().includes('rain')).length;
    const sunnyDays = weatherData.filter(day => day.condition.toLowerCase().includes('clear') || day.condition.toLowerCase().includes('sunny')).length;

    // Temperature recommendations
    if (avgTemp > 25) {
      recommendations.push('Expect warm weather - perfect for outdoor activities');
      packingTips.push('Light, breathable clothing', 'Sunscreen and hat', 'Plenty of water');
    } else if (avgTemp < 15) {
      recommendations.push('Cool weather expected - great for sightseeing');
      packingTips.push('Warm layers', 'Light jacket or sweater', 'Comfortable walking shoes');
    } else {
      recommendations.push('Pleasant temperatures expected - ideal for exploring');
      packingTips.push('Layered clothing', 'Light jacket for evenings');
    }

    // Rain recommendations
    if (rainyDays > weatherData.length / 2) {
      recommendations.push('Rainy weather likely - plan indoor activities');
      packingTips.push('Waterproof jacket or umbrella', 'Quick-dry clothing');
    } else if (rainyDays > 0) {
      recommendations.push('Some rain possible - have backup indoor plans');
      packingTips.push('Light rain jacket or umbrella');
    }

    // Sunny weather recommendations
    if (sunnyDays > weatherData.length / 2) {
      recommendations.push('Mostly sunny weather - great for outdoor sightseeing');
      packingTips.push('Sunglasses', 'Sun protection');
    }

    return {
      weatherData,
      recommendations,
      packingTips,
      summary: {
        avgTemp: Math.round(avgTemp),
        minTemp,
        maxTemp,
        rainyDays,
        sunnyDays
      }
    };

  } catch (error) {
    console.error('❌ Weather recommendations error:', error);
    return {
      recommendations: ['Check local weather conditions before your trip'],
      packingTips: ['Pack versatile clothing for changing weather']
    };
  }
};