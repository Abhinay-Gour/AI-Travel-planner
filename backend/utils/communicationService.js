import { sendTripDetailsEmail } from './emailService.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const isTwilioConfigured = () =>
  process.env.TWILIO_ACCOUNT_SID &&
  !process.env.TWILIO_ACCOUNT_SID.includes('your_') &&
  process.env.TWILIO_AUTH_TOKEN &&
  !process.env.TWILIO_AUTH_TOKEN.includes('your_');

let twilioClient = null;
const getTwilioClient = () => {
  if (!isTwilioConfigured()) return null;
  if (!twilioClient) twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
};

const sendSMS = async (to, body) => {
  const client = getTwilioClient();
  if (!client) return { success: false, message: 'SMS not configured' };
  try {
    const result = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('✅ SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ SMS error:', error.message);
    return { success: false, error: error.message };
  }
};

// Welcome SMS on signup
export const sendWelcomeSMS = async (phone, name) => {
  const msg =
    `🌍 Hi ${name}! Welcome to AI Travel Planner! ✈️\n\n` +
    `Your account is ready. Start planning your dream trip now!\n` +
    `👉 ${process.env.FRONTEND_URL}\n\n` +
    `Happy Travels! 🌟`;
  return sendSMS(phone, msg);
};

// Password reset SMS
export const sendPasswordResetSMS = async (phone, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const msg =
    `🔐 AI Travel Planner - Password Reset\n\n` +
    `Hi ${name}, click the link to reset your password:\n` +
    `${resetUrl}\n\n` +
    `⚠️ Expires in 10 minutes. Ignore if not requested.`;
  return sendSMS(phone, msg);
};

// Send trip details via email
export const sendTripEmail = async (email, name, tripData) => {
  try {
    const result = await sendTripDetailsEmail(email, name, tripData);
    if (result.success) {
      return { success: true, message: 'Email sent successfully', messageId: result.messageId };
    }
    return { success: false, message: 'Email sending failed', error: result.error };
  } catch (error) {
    return { success: false, message: 'Email service error', error: error.message };
  }
};

// Send trip details via SMS
export const sendTripSMS = async (phoneNumber, name, tripData) => {
  const msg =
    `Hi ${name}! 🌍 Your trip to ${tripData.destination} is ready!\n\n` +
    `📅 ${tripData.dates || ''}\n` +
    `💰 Budget: ${tripData.budgetEstimate?.total || 'N/A'}\n\n` +
    `✨ Highlights:\n${tripData.highlights?.slice(0, 3).map(h => `• ${h}`).join('\n') || ''}\n\n` +
    `Check your email for full itinerary. Happy travels! ✈️\n_AI Travel Planner_`;
  return sendSMS(phoneNumber, msg);
};

// Send both email and SMS
export const sendTripCommunications = async (user, tripData) => {
  try {
    const [emailResult, smsResult] = await Promise.all([
      sendTripEmail(user.email, user.name, tripData),
      sendTripSMS(user.phone, user.name, tripData)
    ]);

    return {
      success: emailResult.success,
      results: { email: emailResult, sms: smsResult },
      message: `Email: ${emailResult.success ? 'sent' : 'failed'}, SMS: ${smsResult.success ? 'sent' : 'failed'}`
    };
  } catch (error) {
    return { success: false, message: 'Communication service failed', error: error.message };
  }
};

// Send welcome communications
export const sendWelcomeCommunications = async (user) => {
  try {
    return await sendTripEmail(user.email, user.name, {
      destination: 'AI Travel Planner',
      overview: 'Welcome to the future of travel planning!',
      highlights: ['Personalized itineraries', 'Real-time updates', 'Expert recommendations'],
      budgetEstimate: { total: 'Customized for you' }
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send notification SMS
export const sendNotificationSMS = async (phoneNumber, message) => sendSMS(phoneNumber, message);