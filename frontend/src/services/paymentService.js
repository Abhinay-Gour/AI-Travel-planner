import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('aiTravelToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPlans = async () => {
  const { data } = await axios.get(`${API_URL}/payment/plans`);
  return data.data.plans;
};

export const getSubscription = async () => {
  const { data } = await axios.get(`${API_URL}/payment/subscription`, {
    headers: getAuthHeader()
  });
  return data.data.subscription;
};

// Send WhatsApp message after payment
const sendWhatsAppAfterPayment = (phone, name, plan) => {
  if (!phone) return;

  const planNames = { basic: 'Basic', pro: 'Pro', unlimited: 'Unlimited' };
  const planTrips = { basic: '5 trips', pro: '20 trips', unlimited: 'Unlimited trips' };

  const message =
    `🎉 *Payment Successful!* 🎉\n\n` +
    `Hi ${name}! Your *${planNames[plan]} Plan* is now active on AI Travel Planner.\n\n` +
    `✅ *Plan:* ${planNames[plan]}\n` +
    `✅ *Trips Included:* ${planTrips[plan]}\n` +
    `✅ *Features:* AI Itineraries, Email + WhatsApp delivery, Weather data\n\n` +
    `🚀 *Start Planning Now:*\n` +
    `👉 Visit the website and click "Plan My Trip"\n` +
    `👉 Enter any destination worldwide\n` +
    `👉 Get your full itinerary in seconds!\n\n` +
    `Your complete trip plans will be sent to this WhatsApp automatically.\n\n` +
    `Happy Travels! ✈️\n_AI Travel Planner Team_`;

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Small delay so Razorpay modal closes first
  setTimeout(() => window.open(url, '_blank'), 1000);
};

// Show toast notification
const showToast = (message, type = 'success') => {
  const existing = document.getElementById('payment-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'payment-toast';
  toast.style.cssText = `
    position: fixed; top: 24px; right: 24px; z-index: 99999;
    background: ${type === 'success' ? 'linear-gradient(135deg, #276749, #1a4731)' : '#742a2a'};
    color: #fff; padding: 16px 22px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4); font-size: 14px;
    font-weight: 600; max-width: 340px; line-height: 1.5;
    animation: toastIn 0.3s ease;
  `;
  toast.innerHTML = message;

  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toastIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast?.remove(), 6000);
};

export const initiatePayment = (plan, userInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Create order
      const { data } = await axios.post(
        `${API_URL}/payment/create-order`,
        { plan },
        { headers: getAuthHeader() }
      );

      const orderData = data.data;

      // Step 2: Open Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Travel Planner',
        description: `${orderData.planName} Plan`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify + trigger backend email & SMS
            const verifyRes = await axios.post(
              `${API_URL}/payment/verify`,
              { ...response, plan },
              { headers: getAuthHeader() }
            );

            const { userName, userPhone } = verifyRes.data.data || {};

            // Step 4: Show success toast
            showToast(
              `🎉 Payment Successful!<br>` +
              `✅ ${orderData.planName} Plan activated<br>` +
              `📧 Confirmation email sent<br>` +
              `📱 WhatsApp message opening...`
            );

            // Step 5: Open WhatsApp
            sendWhatsAppAfterPayment(
              userPhone || userInfo?.phone,
              userName || userInfo?.name,
              plan
            );

            resolve({ success: true, plan, userName, userPhone });
          } catch (err) {
            reject(new Error('Payment verification failed'));
          }
        },
        prefill: {
          name: orderData.userName || userInfo?.name || '',
          email: orderData.userEmail || userInfo?.email || '',
          contact: userInfo?.phone || ''
        },
        theme: { color: '#e53e3e' },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled'))
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      reject(err);
    }
  });
};
