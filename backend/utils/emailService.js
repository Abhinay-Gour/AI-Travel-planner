import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🌟 Welcome to AI Travel Planner!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f43f5e, #9f1239); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">✈️ Welcome to AI Travel Planner!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Welcome to the future of travel planning! We're excited to help you create amazing travel experiences with the power of AI.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f43f5e; margin-top: 0;">🎯 What you can do:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>Generate personalized trip itineraries in seconds</li>
                <li>Get real-time weather and location data</li>
                <li>Receive trip details via email and SMS</li>
                <li>Save and share your favorite trips</li>
                <li>Discover amazing destinations from other travelers</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #f43f5e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify Your Email 📧
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px;">
              If the button doesn't work, copy and paste this link: <br>
              <a href="${verificationUrl}" style="color: #f43f5e;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Happy travels! 🌍</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">AI Travel Planner Team</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f43f5e, #9f1239); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #f43f5e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password 🔑
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ This link will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <p style="color: #777; font-size: 14px;">
              If you didn't request this reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #777; font-size: 14px;">
              If the button doesn't work, copy and paste this link: <br>
              <a href="${resetUrl}" style="color: #f43f5e;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">AI Travel Planner Team 🌍</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Password reset email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send payment success email
export const sendPaymentSuccessEmail = async (email, name, plan) => {
  try {
    const transporter = createTransporter();
    const planDetails = {
      basic:     { name: 'Basic',     price: '₹499', trips: '5 trips', color: '#3182ce' },
      pro:       { name: 'Pro',       price: '₹999', trips: '20 trips', color: '#e53e3e' },
      unlimited: { name: 'Unlimited', price: '₹1999', trips: 'Unlimited trips', color: '#805ad5' }
    };
    const p = planDetails[plan] || planDetails.basic;

    const mailOptions = {
      from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Payment Successful — ${p.name} Plan Activated!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff;">
          <div style="background: linear-gradient(135deg, ${p.color}, #1a1a1a); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h1 style="margin: 0; font-size: 26px; color: #fff;">Payment Successful!</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 15px;">Your ${p.name} Plan is now active</p>
          </div>

          <div style="padding: 32px 30px; background: #111;">
            <h2 style="color: #fff; margin-top: 0;">Hi ${name}! 👋</h2>
            <p style="color: #aaa; line-height: 1.7;">Thank you for upgrading to the <strong style="color: ${p.color};">${p.name} Plan</strong>. You can now plan amazing trips with full AI power!</p>

            <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="color: ${p.color}; margin-top: 0;">📋 Plan Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="color: #888; padding: 8px 0; border-bottom: 1px solid #2a2a2a;">Plan</td><td style="color: #fff; text-align: right; padding: 8px 0; border-bottom: 1px solid #2a2a2a;"><strong>${p.name}</strong></td></tr>
                <tr><td style="color: #888; padding: 8px 0; border-bottom: 1px solid #2a2a2a;">Amount Paid</td><td style="color: #fff; text-align: right; padding: 8px 0; border-bottom: 1px solid #2a2a2a;"><strong>${p.price}/month</strong></td></tr>
                <tr><td style="color: #888; padding: 8px 0;">Trip Plans</td><td style="color: ${p.color}; text-align: right; padding: 8px 0;"><strong>${p.trips}</strong></td></tr>
              </table>
            </div>

            <div style="background: #0d1f0d; border: 1px solid #276749; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #48bb78; margin-top: 0;">✅ What's Unlocked</h3>
              <ul style="color: #9ae6b4; line-height: 2; margin: 0; padding-left: 20px;">
                <li>AI-powered day-by-day itineraries</li>
                <li>Instant Email delivery of trip plans</li>
                <li>WhatsApp notifications</li>
                <li>Real-time weather integration</li>
                <li>Smart packing lists</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL}" style="background: ${p.color}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Start Planning Now ✈️</a>
            </div>
          </div>

          <div style="background: #0a0a0a; color: #555; padding: 20px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">AI Travel Planner · Happy Travels! 🌍</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Payment success email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Payment success email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send trip details email
export const sendTripDetailsEmail = async (email, name, tripData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎯 Your AI Travel Plan for ${tripData.destination}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f43f5e, #9f1239); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Your Trip Plan is Ready!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${name}! ✈️</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f43f5e; margin-top: 0;">🌟 ${tripData.destination}</h3>
              <p><strong>📅 Duration:</strong> ${tripData.duration}</p>
              <p><strong>📆 Dates:</strong> ${tripData.dates}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">✨ Trip Overview</h4>
              <p style="color: #555; line-height: 1.6;">${tripData.overview}</p>
            </div>
            
            ${tripData.highlights ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">🎯 Top Highlights</h4>
              <ul style="color: #555; line-height: 1.8;">
                ${tripData.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${tripData.budgetEstimate ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">💰 Budget Estimate</h4>
              <p style="color: #555;"><strong>Total:</strong> ${tripData.budgetEstimate.total || 'Calculated based on your preferences'}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/trip/${tripData._id}" 
                 style="background: #f43f5e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Full Itinerary 📋
              </a>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-size: 14px;">
                ✅ Your complete day-by-day itinerary with activities, locations, and tips is available in your account!
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Have an amazing trip! 🌍</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">AI Travel Planner Team</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Trip details email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Trip details email failed:', error);
    return { success: false, error: error.message };
  }
};