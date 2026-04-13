import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plans config (amount in paise — 1 INR = 100 paise)
const PLANS = {
  basic:     { amount: 49900,  name: 'Basic',     trips: 5,  currency: 'INR' },
  pro:       { amount: 99900,  name: 'Pro',        trips: 20, currency: 'INR' },
  unlimited: { amount: 199900, name: 'Unlimited',  trips: -1, currency: 'INR' }
};

// Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const planConfig = PLANS[plan];

    if (!planConfig) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const order = await razorpay.orders.create({
      amount: planConfig.amount,
      currency: planConfig.currency,
      receipt: `receipt_${req.user._id}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan, userEmail: req.user.email }
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
        planName: planConfig.name,
        keyId: process.env.RAZORPAY_KEY_ID,
        userEmail: req.user.email,
        userName: req.user.name
      }
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// Verify payment after frontend completes it
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, tripData } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update user subscription
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.razorpayPaymentId': razorpay_payment_id,
        'subscription.razorpayOrderId': razorpay_order_id,
        'subscription.startDate': new Date()
      },
      { new: true }
    );

    // Send payment success email + WhatsApp in background
    const planNames = { basic: 'Basic', pro: 'Pro', unlimited: 'Unlimited' };
    const sendData = tripData || {
      destination: 'Your Next Adventure',
      duration: 'As per your plan',
      dates: 'Plan your trip now!',
      overview: `You have successfully activated the ${planNames[plan]} plan. Start planning your dream trips now!`,
      highlights: ['AI-powered itineraries', 'Email & WhatsApp delivery', 'Real-time weather data'],
      budgetEstimate: { total: 'Customized for each trip' },
      travelTips: ['Login and click Plan My Trip to get started', 'Enter any destination worldwide', 'Get your full itinerary in seconds']
    };

    // Fire and forget — don't block response
    sendPaymentSuccessNotifications(user, plan, sendData).catch(err =>
      console.error('Payment notification error:', err)
    );

    res.json({ success: true, message: 'Payment verified successfully', data: { plan, userName: user.name, userPhone: user.phone } });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
});

// Helper: send email + SMS after payment
const sendPaymentSuccessNotifications = async (user, plan, tripData) => {
  const { sendTripEmail, sendTripSMS } = await import('../utils/communicationService.js');
  const { sendPaymentSuccessEmail } = await import('../utils/emailService.js');

  await Promise.allSettled([
    sendPaymentSuccessEmail(user.email, user.name, plan),
    sendTripEmail(user.email, user.name, tripData),
    sendTripSMS(user.phone, user.name, tripData)
  ]);

  console.log(`✅ Payment notifications sent to ${user.email} / ${user.phone}`);
};

// Razorpay webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const { userId, plan } = payment.notes;

      await User.findByIdAndUpdate(userId, {
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.razorpayPaymentId': payment.id,
        'subscription.startDate': new Date()
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Get subscription status
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    res.json({
      success: true,
      data: { subscription: user.subscription || { plan: 'free', status: 'active' } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
});

// Get available plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: {
      plans: Object.entries(PLANS).map(([key, val]) => ({
        id: key,
        name: val.name,
        amount: val.amount / 100,
        currency: val.currency,
        trips: val.trips === -1 ? 'Unlimited' : val.trips
      }))
    }
  });
});

export default router;
