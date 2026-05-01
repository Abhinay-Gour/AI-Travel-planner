import express from 'express';
import { body, validationResult, query } from 'express-validator';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user stats
    const user = await User.findById(userId);
    
    // Get recent trips
    const recentTrips = await Trip.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('destination duration createdAt status');

    // Get trip statistics
    const tripStats = await Trip.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDays: { 
            $sum: { 
              $toInt: { 
                $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] 
              } 
            } 
          },
          destinations: { $addToSet: '$destination' },
          countries: { $addToSet: '$country' }
        }
      }
    ]);

    const stats = tripStats[0] || {
      totalTrips: 0,
      totalDays: 0,
      destinations: [],
      countries: []
    };

    // Get monthly trip creation data for charts
    const monthlyData = await Trip.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        recentTrips,
        stats: {
          ...stats,
          uniqueDestinations: stats.destinations.length,
          uniqueCountries: stats.countries.length
        },
        monthlyData
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('preferences.budget').optional().isIn(['budget', 'mid-range', 'luxury']),
  body('preferences.travelStyle').optional().isIn(['adventure', 'relaxation', 'cultural', 'business', 'family']),
  body('preferences.interests').optional().isArray(),
  body('preferences.currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('preferences.language').optional().isLength({ min: 2, max: 5 }).withMessage('Language code required')
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

    const { name, phone, preferences } = req.body;
    const user = await User.findById(req.user._id);

    // Update basic info
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    // Update preferences
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get user's favorite trips
router.get('/favorites', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const favorites = await Trip.find({ 
      user: req.user._id, 
      isFavorite: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar');

    const total = await Trip.countDocuments({ 
      user: req.user._id, 
      isFavorite: true 
    });

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
});

// Get user's trip history with filters
router.get('/trip-history', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['draft', 'planned', 'ongoing', 'completed', 'cancelled']),
  query('year').optional().isInt({ min: 2020, max: 2030 }),
  query('destination').optional().trim()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, year, destination } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (destination) filter.destination = { $regex: destination, $options: 'i' };
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);
      filter.createdAt = { $gte: startOfYear, $lte: endOfYear };
    }

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('destination duration startDate endDate status createdAt budgetEstimate highlights');

    const total = await Trip.countDocuments(filter);

    // Get summary stats for the filtered results
    const summaryStats = await Trip.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalDays: { 
            $sum: { 
              $toInt: { 
                $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] 
              } 
            } 
          },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);

    const summary = summaryStats[0] || { totalTrips: 0, totalDays: 0, statusBreakdown: [] };
    
    // Count status breakdown
    const statusCounts = summary.statusBreakdown.reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        trips,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        summary: {
          totalTrips: summary.totalTrips,
          totalDays: summary.totalDays,
          statusBreakdown: statusCounts
        }
      }
    });

  } catch (error) {
    console.error('Trip history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip history'
    });
  }
});

// Get user's travel statistics
router.get('/travel-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Comprehensive travel statistics
    const stats = await Trip.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          // Overall stats
          overall: [
            {
              $group: {
                _id: null,
                totalTrips: { $sum: 1 },
                totalDays: { 
                  $sum: { 
                    $toInt: { 
                      $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] 
                    } 
                  } 
                },
                destinations: { $addToSet: '$destination' },
                countries: { $addToSet: '$country' }
              }
            }
          ],
          
          // Monthly breakdown
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 },
                days: { 
                  $sum: { 
                    $toInt: { 
                      $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] 
                    } 
                  } 
                }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ],
          
          // Status breakdown
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Top destinations
          topDestinations: [
            {
              $group: {
                _id: '$destination',
                count: { $sum: 1 },
                totalDays: { 
                  $sum: { 
                    $toInt: { 
                      $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] 
                    } 
                  } 
                }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    const result = stats[0];
    const overall = result.overall[0] || { totalTrips: 0, totalDays: 0, destinations: [], countries: [] };

    res.json({
      success: true,
      data: {
        overall: {
          ...overall,
          uniqueDestinations: overall.destinations.length,
          uniqueCountries: overall.countries.length,
          avgTripDuration: overall.totalTrips > 0 ? Math.round(overall.totalDays / overall.totalTrips) : 0
        },
        monthly: result.monthly,
        statusBreakdown: result.statusBreakdown,
        topDestinations: result.topDestinations
      }
    });

  } catch (error) {
    console.error('Travel stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch travel statistics'
    });
  }
});

// Delete user account
router.delete('/account', authenticateToken, [
  body('confirmPassword').notEmpty().withMessage('Password confirmation required')
], async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(confirmPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    // Also soft delete all user's trips
    await Trip.updateMany(
      { user: req.user._id },
      { isPublic: false, status: 'cancelled' }
    );

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

// Public leaderboard — top travelers by trips
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({ isActive: true })
      .sort({ 'stats.tripsPlanned': -1 })
      .limit(10)
      .select('name stats avatar');
    res.json({ success: true, data: topUsers });
  } catch {
    res.json({ success: true, data: [] });
  }
});

// Public stats — no auth needed (for homepage)
router.get('/stats/public', async (req, res) => {
  try {
    const [totalTrips, totalUsers] = await Promise.all([
      Trip.countDocuments(),
      User.countDocuments({ isActive: true })
    ]);
    res.json({ success: true, data: { totalTrips, totalUsers } });
  } catch {
    res.json({ success: true, data: { totalTrips: 0, totalUsers: 0 } });
  }
});

// Track user events / page views
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { event, page } = req.body;
    // Lightweight — just log it, can be extended to store in DB
    console.log(`📊 [TRACK] user=${req.user._id} event=${event} page=${page}`);
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

export default router;