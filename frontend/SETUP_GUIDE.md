# 🔑 API Keys Setup Guide — Real Booking Integration

## Step 1 — Gemini AI (Already Done ✅)
Already configured in .env

---

## Step 2 — Amadeus Flights API (FREE)
Real-time flight search

1. Go to: https://developers.amadeus.com
2. Click "Register" → Create free account
3. Go to "My Apps" → "Create New App"
4. Copy **API Key** and **API Secret**
5. Add to .env:
```
VITE_AMADEUS_API_KEY=your_key_here
VITE_AMADEUS_API_SECRET=your_secret_here
```
**Free tier:** 2000 calls/month

---

## Step 3 — RapidAPI (Hotels + Trains)
1. Go to: https://rapidapi.com
2. Sign up free
3. Subscribe to these APIs (free tiers available):
   - **Booking.com API** → search "booking-com"
   - **IRCTC API** → search "irctc1"
4. Copy your RapidAPI Key from dashboard
5. Add to .env:
```
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

---

## Step 4 — OpenWeather API (FREE)
Real weather forecasts

1. Go to: https://openweathermap.org/api
2. Sign up free
3. Go to "API Keys" tab
4. Copy your key
5. Add to .env:
```
VITE_WEATHER_API_KEY=your_key_here
```
**Free tier:** 1000 calls/day

---

## Step 5 — Deploy on Vercel (FREE)

```bash
# Install Node.js from https://nodejs.org first

cd "C:\Users\Maanvi Panwar\AI-Travel-planner\Ai travel"
npm install
npm run build

# Deploy
npm install -g vercel
vercel
```

Or drag & drop `dist` folder to https://netlify.com

---

## Without API Keys
Everything still works with smart fallbacks:
- Flights → Shows real prices, redirects to MakeMyTrip/Google Flights
- Hotels → Shows curated hotels, redirects to Booking.com
- Trains → Shows schedules, redirects to IRCTC
- Buses → Redirects to RedBus
- Weather → Shows destination-specific static forecast
