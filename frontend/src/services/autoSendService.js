import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Send trip email via backend
export const sendEmailDirectly = async (userEmail, userName, tripData) => {
  try {
    const token = localStorage.getItem('aiTravelToken');
    const { data } = await axios.post(
      `${API_URL}/email/send-trip`,
      { email: userEmail, name: userName, tripData },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
    );
    console.log('✅ Email sent:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return { success: false, message: error.message };
  }
};

// WhatsApp share — only opens when user clicks, NOT auto
export const getWhatsAppLink = (phoneNumber, userName, tripData) => {
  const msg = `✈️ *${tripData.destination} Trip Plan Ready!*\n\nHi ${userName}!\n📅 ${tripData.duration} | ${tripData.dates}\n\n✨ ${tripData.overview?.substring(0, 150)}...\n\n💰 Budget: ${tripData.budgetEstimate?.total || 'See email'}\n\n📧 Full itinerary sent to your email!\n\n_AI Travel Planner_`;
  const clean = phoneNumber.replace(/[^0-9+]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
};

// Main function — only sends email, no auto WhatsApp tab
export const sendTripPlanDirectly = async (user, tripData) => {
  try {
    showNotification('📧 Sending trip plan to your email...');
    const emailResult = await sendEmailDirectly(user.email, user.name, tripData);

    if (emailResult.success) {
      showNotification('✅ Trip plan sent to ' + user.email + '!', 'success');
    } else {
      showNotification('⚠️ Email failed — check backend', 'error');
    }

    return { success: emailResult.success, email: emailResult };
  } catch (error) {
    console.error('❌ sendTripPlanDirectly error:', error);
    return { success: false };
  }
};

const showNotification = (message, type = 'info') => {
  const existing = document.getElementById('tripNotification');
  if (existing) existing.remove();

  const colors = {
    info: 'linear-gradient(135deg, #f43f5e, #9f1239)',
    success: 'linear-gradient(135deg, #10b981, #065f46)',
    error: 'linear-gradient(135deg, #ef4444, #7f1d1d)',
  };

  const el = document.createElement('div');
  el.id = 'tripNotification';
  el.style.cssText = `
    position:fixed;top:20px;right:20px;
    background:${colors[type]};color:white;
    padding:14px 20px;border-radius:12px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    z-index:10000;font-size:14px;font-weight:600;
    max-width:300px;animation:slideIn 0.3s ease;
  `;
  el.textContent = message;

  if (!document.querySelector('#notifStyle')) {
    const s = document.createElement('style');
    s.id = 'notifStyle';
    s.textContent = `@keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}`;
    document.head.appendChild(s);
  }

  document.body.appendChild(el);
  setTimeout(() => el?.remove(), 5000);
};
