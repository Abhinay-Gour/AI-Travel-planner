import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Single persistent transporter — reuse connection pool
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,          // reuse connections
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
  tls: { rejectUnauthorized: false }
});

// Verify connection on startup
transporter.verify((err) => {
  if (err) console.error('❌ Email transporter error:', err.message);
  else console.log('✅ Email transporter ready');
});

// Send welcome email
export const sendWelcomeEmail = async (email, name, verificationToken) => {
  try {
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

// Generate plain text trip plan (like MakeMyTrip ticket)
const generateTripText = (name, tripData) => {
  const divider = '='.repeat(55);
  const line = '-'.repeat(55);
  let text = `${divider}\n       ✈️  AI TRAVEL PLANNER — TRIP CONFIRMATION\n${divider}\n`;
  text += `Passenger  : ${name}\n`;
  text += `Destination: ${tripData.destination}\n`;
  text += `Duration   : ${tripData.duration}\n`;
  text += `Dates      : ${tripData.dates}\n`;
  text += `${line}\n\nOVERVIEW\n${tripData.overview}\n\n`;

  if (tripData.highlights?.length) {
    text += `${line}\nTOP HIGHLIGHTS\n`;
    tripData.highlights.forEach(h => { text += `  • ${h}\n`; });
    text += '\n';
  }

  if (tripData.budgetEstimate) {
    text += `${line}\nBUDGET ESTIMATE\n`;
    Object.entries(tripData.budgetEstimate).forEach(([k, v]) => {
      text += `  ${k.charAt(0).toUpperCase() + k.slice(1).padEnd(14)}: ${v}\n`;
    });
    text += '\n';
  }

  if (tripData.dailyItinerary?.length) {
    text += `${line}\nDAY-BY-DAY ITINERARY\n`;
    tripData.dailyItinerary.forEach(day => {
      text += `\n📅 DAY ${day.day} — ${day.title} (${day.date})\n`;
      day.activities?.forEach(act => {
        text += `  ${act.time}  ${act.activity}\n`;
        text += `           📍 ${act.location}  |  ⏱ ${act.duration}  |  💰 ${act.cost}\n`;
        if (act.description) text += `           ${act.description}\n`;
      });
    });
    text += '\n';
  }

  if (tripData.travelTips?.length) {
    text += `${line}\nTRAVEL TIPS\n`;
    tripData.travelTips.forEach(tip => { text += `  💡 ${tip}\n`; });
  }

  text += `\n${divider}\nGenerated by AI Travel Planner ✈️  |  Have an amazing trip!\n${divider}`;
  return text;
};

// Send trip details email with full itinerary (MakeMyTrip style)
export const sendTripDetailsEmail = async (email, name, tripData) => {
  try {
    const plainText = generateTripText(name, tripData);

    const dailyItineraryHtml = tripData.dailyItinerary?.map(day => `
      <div style="background:#fff;border-radius:8px;padding:16px;margin:10px 0;border-left:4px solid #f43f5e;">
        <div style="font-weight:700;color:#f43f5e;font-size:15px;">📅 Day ${day.day} — ${day.title} <span style="color:#888;font-size:13px;font-weight:400;">${day.date}</span></div>
        ${day.activities?.map(act => `
          <div style="margin:10px 0 0 10px;padding:10px;background:#fafafa;border-radius:6px;">
            <div style="font-weight:600;color:#333;">${act.time} &nbsp; ${act.activity}</div>
            <div style="color:#666;font-size:13px;margin-top:4px;">📍 ${act.location} &nbsp;|&nbsp; ⏱ ${act.duration} &nbsp;|&nbsp; 💰 ${act.cost}</div>
            ${act.description ? `<div style="color:#777;font-size:13px;margin-top:4px;">${act.description}</div>` : ''}
          </div>`).join('') || ''}
      </div>`).join('') || '';

    const budgetHtml = tripData.budgetEstimate ? `
      <div style="background:#fff;padding:20px;border-radius:8px;margin:16px 0;">
        <h4 style="color:#333;margin-top:0;">💰 Budget Estimate</h4>
        <table style="width:100%;border-collapse:collapse;">
          ${Object.entries(tripData.budgetEstimate).map(([k, v]) => `
            <tr>
              <td style="padding:8px 0;color:#555;border-bottom:1px solid #eee;">${k.charAt(0).toUpperCase() + k.slice(1)}</td>
              <td style="padding:8px 0;color:#f43f5e;font-weight:600;text-align:right;border-bottom:1px solid #eee;">${v}</td>
            </tr>`).join('')}
        </table>
      </div>` : '';

    const mailOptions = {
      from: `"AI Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎯 Your Trip to ${tripData.destination} is Confirmed! — AI Travel Planner`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;background:#f4f4f4;">
          <div style="background:linear-gradient(135deg,#f43f5e,#9f1239);padding:32px;text-align:center;color:white;">
            <div style="font-size:40px;">✈️</div>
            <h1 style="margin:8px 0 4px;font-size:24px;">Trip Plan Confirmed!</h1>
            <p style="margin:0;opacity:0.9;font-size:15px;">Your AI-generated itinerary for ${tripData.destination}</p>
          </div>
          <div style="padding:24px;background:#f4f4f4;">
            <div style="background:#fff;border-radius:10px;padding:20px;margin-bottom:16px;">
              <h2 style="color:#333;margin-top:0;">Hi ${name}! 👋</h2>
              <table style="width:100%;">
                <tr><td style="color:#888;padding:6px 0;">🌍 Destination</td><td style="font-weight:700;color:#333;">${tripData.destination}</td></tr>
                <tr><td style="color:#888;padding:6px 0;">📅 Duration</td><td style="font-weight:700;color:#333;">${tripData.duration}</td></tr>
                <tr><td style="color:#888;padding:6px 0;">📆 Dates</td><td style="font-weight:700;color:#333;">${tripData.dates}</td></tr>
              </table>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;margin:16px 0;">
              <h4 style="color:#333;margin-top:0;">✨ Overview</h4>
              <p style="color:#555;line-height:1.7;margin:0;">${tripData.overview}</p>
            </div>
            ${tripData.highlights?.length ? `
            <div style="background:#fff;padding:20px;border-radius:8px;margin:16px 0;">
              <h4 style="color:#333;margin-top:0;">🎯 Top Highlights</h4>
              <ul style="color:#555;line-height:2;margin:0;padding-left:20px;">
                ${tripData.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>` : ''}
            ${budgetHtml}
            ${dailyItineraryHtml ? `
            <div style="background:#fff;padding:20px;border-radius:8px;margin:16px 0;">
              <h4 style="color:#333;margin-top:0;">📋 Day-by-Day Itinerary</h4>
              ${dailyItineraryHtml}
            </div>` : ''}
            ${tripData.travelTips?.length ? `
            <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:16px;border-radius:8px;margin:16px 0;">
              <h4 style="color:#856404;margin-top:0;">💡 Travel Tips</h4>
              <ul style="color:#856404;line-height:1.9;margin:0;padding-left:20px;">
                ${tripData.travelTips.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>` : ''}
          </div>
          <div style="background:#333;color:white;padding:20px;text-align:center;">
            <p style="margin:0;font-size:15px;">Have an amazing trip! 🌍</p>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.7;">AI Travel Planner Team</p>
          </div>
        </div>`,
      attachments: [{
        filename: `${tripData.destination.replace(/[^a-zA-Z0-9]/g, '_')}_trip_plan.txt`,
        content: plainText,
        contentType: 'text/plain'
      }]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Trip details email sent:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Trip details email failed:', error);
    return { success: false, error: error.message };
  }
};