import { sendTripDetailsEmail } from './emailService.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log('📱 Twilio not configured, skipping SMS');
      return { success: false, message: 'SMS service not configured' };
    }

    const message = `Hi ${name}! 🌍 Your trip to ${tripData.destination} is ready!\n\n📅 ${tripData.dates || ''}\n💰 Budget: ${tripData.budgetEstimate?.total || 'N/A'}\n\n✨ Highlights:\n${tripData.highlights?.slice(0, 3).map(h => `• ${h}`).join('\n') || ''}\n\nCheck your email for the full day-by-day itinerary. Happy travels! ✈️\n\n_AI Travel Planner_`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('✅ SMS sent:', result.sid);
    return { success: true, message: 'SMS sent successfully', sid: result.sid };
  } catch (error) {
    console.error('❌ Trip SMS error:', error);
    return { success: false, message: 'SMS service error', error: error.message };
  }
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
export const sendNotificationSMS = async (phoneNumber, message) => {
  try {
    const client = getTwilioClient();
    if (!client) return { success: false, message: 'SMS service not configured' };

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return { success: true, sid: result.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};