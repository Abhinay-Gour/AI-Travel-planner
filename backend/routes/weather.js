import express from 'express';
import { query, validationResult } from 'express-validator';
import { getCurrentWeather, getWeatherData, getWeatherRecommendations } from '../utils/weatherService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current weather for a location
router.get('/current', [
  query('location').trim().isLength({ min: 2 }).withMessage('Location required (min 2 characters)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { location } = req.query;
    
    const weatherData = await getCurrentWeather(location);
    
    if (!weatherData) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available for this location'
      });
    }

    res.json({
      success: true,
      data: {
        weather: weatherData
      }
    });

  } catch (error) {
    console.error('Current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current weather'
    });
  }
});

// Get weather forecast for trip dates
router.get('/forecast', [
  query('location').trim().isLength({ min: 2 }).withMessage('Location required'),
  query('startDate').isISO8601().withMessage('Valid start date required (YYYY-MM-DD)'),
  query('endDate').isISO8601().withMessage('Valid end date required (YYYY-MM-DD)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { location, startDate, endDate } = req.query;
    
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    if (end < today) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be in the past'
      });
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 14) {
      return res.status(400).json({
        success: false,
        message: 'Weather forecast available for maximum 14 days'
      });
    }

    const weatherData = await getWeatherData(location, startDate, endDate);

    res.json({
      success: true,
      data: {
        location,
        startDate,
        endDate,
        duration: `${diffDays} days`,
        forecast: weatherData
      }
    });

  } catch (error) {
    console.error('Weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather forecast'
    });
  }
});

// Get weather recommendations for travel
router.get('/recommendations', [
  query('location').trim().isLength({ min: 2 }).withMessage('Location required'),
  query('startDate').isISO8601().withMessage('Valid start date required'),
  query('endDate').isISO8601().withMessage('Valid end date required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { location, startDate, endDate } = req.query;
    
    const recommendations = await getWeatherRecommendations(location, startDate, endDate);

    res.json({
      success: true,
      data: {
        location,
        period: `${startDate} to ${endDate}`,
        ...recommendations
      }
    });

  } catch (error) {
    console.error('Weather recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather recommendations'
    });
  }
});

// Get weather for multiple locations (for comparison)
router.post('/compare', optionalAuth, [
  query('locations').custom((value) => {
    const locations = value.split(',').map(loc => loc.trim());
    if (locations.length < 2 || locations.length > 5) {
      throw new Error('Provide 2-5 locations separated by commas');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const locations = req.query.locations.split(',').map(loc => loc.trim());
    
    // Get weather for all locations in parallel
    const weatherPromises = locations.map(location => 
      getCurrentWeather(location).then(data => ({
        location,
        weather: data
      }))
    );

    const results = await Promise.allSettled(weatherPromises);
    
    const comparison = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          location: locations[index],
          weather: null,
          error: 'Weather data not available'
        };
      }
    });

    res.json({
      success: true,
      data: {
        comparison,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Weather comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare weather data'
    });
  }
});

// Get weather alerts/warnings for a location
router.get('/alerts', [
  query('location').trim().isLength({ min: 2 }).withMessage('Location required')
], async (req, res) => {
  try {
    const { location } = req.query;
    
    // This would integrate with weather alert APIs in production
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        location,
        alerts: [],
        message: 'No weather alerts currently active',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts'
    });
  }
});

export default router;