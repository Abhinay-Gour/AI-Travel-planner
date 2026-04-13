import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { generateTripWithAI } from '../utils/aiService.js';
import { sendTripEmail, sendTripSMS } from '../utils/communicationService.js';
import { getWeatherData } from '../utils/weatherService.js';

const router = express.Router();

// Create new trip
router.post('/create', authenticateToken, [
  body('destination').trim().isLength({ min: 2 }).withMessage('Destination required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('preferences').optional().isString()
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

    const { destination, startDate, endDate, preferences } = req.body;
    const user = req.user;

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log('🚀 Generating AI trip plan...');
    const startTime = Date.now();

    // Generate trip using AI
    const aiTripData = await generateTripWithAI({
      destination,
      startDate,
      endDate,
      duration: diffDays,
      preferences,
      userPreferences: user.preferences
    });

    const generationTime = Date.now() - startTime;

    // Get weather data for the trip
    let weatherData = [];
    try {
      weatherData = await getWeatherData(destination, startDate, endDate);
    } catch (weatherError) {
      console.error('Weather data fetch failed:', weatherError);
    }

    // Create trip in database
    const trip = new Trip({
      user: user._id,
      destination,
      startDate,
      endDate,
      duration: `${diffDays} days`,
      dates: `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
      ...aiTripData,
      preferences,
      travelStyle: user.preferences.travelStyle,
      budgetRange: user.preferences.budget,
      generationTime,
      weatherData
    });

    await trip.save();

    // Update user stats
    await user.updateTripStats(trip);

    // Send email and SMS in background
    Promise.all([
      sendTripEmail(user.email, user.name, trip),
      sendTripSMS(user.phone, user.name, trip)
    ]).then(([emailResult, smsResult]) => {
      console.log('📧 Email sent:', emailResult.success);
      console.log('📱 SMS sent:', smsResult.success);
      
      // Update trip with send status
      trip.emailSent = emailResult.success;
      trip.smsSent = smsResult.success;
      trip.save();
    }).catch(error => {
      console.error('Communication error:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: {
        trip: await trip.populate('user', 'name email avatar')
      }
    });

  } catch (error) {
    console.error('Trip creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message
    });
  }
});

// Get user's trips
router.get('/my-trips', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('status').optional().isIn(['draft', 'planned', 'ongoing', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email avatar');

    const total = await Trip.countDocuments(filter);

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Fetch trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
});

// Get single trip
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user can view this trip
    const isOwner = req.user && trip.user._id.toString() === req.user._id.toString();
    if (!trip.isPublic && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Trip is private'
      });
    }

    // Increment views if not owner
    if (!isOwner) {
      await trip.incrementViews();
    }

    res.json({
      success: true,
      data: {
        trip: isOwner ? trip : trip.getPublicData()
      }
    });

  } catch (error) {
    console.error('Fetch trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip'
    });
  }
});

// Update trip
router.put('/:id', authenticateToken, [
  body('destination').optional().trim().isLength({ min: 2 }),
  body('isPublic').optional().isBoolean(),
  body('status').optional().isIn(['draft', 'planned', 'ongoing', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['destination', 'isPublic', 'status', 'isFavorite'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: {
        trip: await trip.populate('user', 'name email avatar')
      }
    });

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip'
    });
  }
});

// Delete trip
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip'
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip'
    });
  }
});

// Get public trips (explore page)
router.get('/public/explore', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 20 }),
  query('destination').optional().trim(),
  query('sort').optional().isIn(['recent', 'popular', 'liked'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const destination = req.query.destination;
    const sort = req.query.sort || 'recent';

    const filter = { isPublic: true };
    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }

    let sortOption = { createdAt: -1 }; // recent
    if (sort === 'popular') sortOption = { views: -1, createdAt: -1 };
    if (sort === 'liked') sortOption = { 'likes.length': -1, createdAt: -1 };

    const trips = await Trip.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar')
      .select('-dailyItinerary -travelTips -packingList'); // Exclude detailed data for listing

    const total = await Trip.countDocuments(filter);

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Explore trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public trips'
    });
  }
});

// Like/unlike trip
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    await trip.toggleLike(req.user._id);

    res.json({
      success: true,
      message: 'Trip like toggled',
      data: {
        likesCount: trip.likes.length,
        isLiked: trip.likes.some(like => like.user.toString() === req.user._id.toString())
      }
    });

  } catch (error) {
    console.error('Like trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like trip'
    });
  }
});

// Add comment to trip
router.post('/:id/comment', authenticateToken, [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters')
], async (req, res) => {
  try {
    const { text } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (!trip.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Cannot comment on private trip'
      });
    }

    await trip.addComment(req.user._id, text);
    await trip.populate('comments.user', 'name avatar');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: trip.comments[trip.comments.length - 1]
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// Get trip statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Trip.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDays: { $sum: { $toInt: { $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] } } },
          avgDuration: { $avg: { $toInt: { $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] } } },
          destinations: { $addToSet: '$destination' }
        }
      }
    ]);

    const result = stats[0] || {
      totalTrips: 0,
      totalDays: 0,
      avgDuration: 0,
      destinations: []
    };

    res.json({
      success: true,
      data: {
        ...result,
        uniqueDestinations: result.destinations.length
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;