import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { sendTripEmail } from '../utils/communicationService.js';
import Trip from '../models/Trip.js';

const router = express.Router();

// Send trip details via email — accepts direct tripData (no DB lookup needed)
router.post('/send-trip', authenticateToken, [
  body('email').isEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().withMessage('Name required'),
  body('tripData').notEmpty().withMessage('Trip data required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { email, name, tripData } = req.body;
    const result = await sendTripEmail(email, name, tripData);

    if (result.success) {
      res.json({ success: true, message: 'Trip email sent successfully', data: { email, messageId: result.messageId } });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email', error: result.error });
    }
  } catch (error) {
    console.error('Send trip email error:', error);
    res.status(500).json({ success: false, message: 'Email service error', error: error.message });
  }
});

// Resend trip email
router.post('/resend-trip/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const user = req.user;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await sendTripEmail(user.email, user.name, trip);

    if (result.success) {
      trip.emailSent = true;
      await trip.save();

      res.json({
        success: true,
        message: 'Trip email resent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to resend email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend email'
    });
  }
});

// Send custom email
router.post('/send-custom', authenticateToken, [
  body('to').isEmail().withMessage('Valid recipient email required'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject required (max 200 chars)'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message required (max 2000 chars)')
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

    const { to, subject, message } = req.body;
    const user = req.user;

    // Create a custom trip-like object for the email template
    const customData = {
      destination: 'Custom Message',
      overview: message,
      highlights: [],
      budgetEstimate: { total: 'N/A' },
      _id: 'custom'
    };

    const result = await sendTripEmail(to, user.name, customData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Custom email sent successfully',
        data: {
          to,
          subject,
          messageId: result.messageId
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send custom email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Send custom email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send custom email'
    });
  }
});

// Get email sending history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Get trips with email sent status
    const emailHistory = await Trip.find({ 
      user: user._id,
      emailSent: true 
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('destination duration createdAt updatedAt emailSent');

    res.json({
      success: true,
      data: {
        history: emailHistory,
        total: emailHistory.length
      }
    });

  } catch (error) {
    console.error('Email history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email history'
    });
  }
});

export default router;