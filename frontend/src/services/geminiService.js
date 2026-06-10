import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildReferencePrompt } from './destinationsData';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Curated static Unsplash image IDs
const DEST_IMAGES = {
  paris: 'photo-1502602898657-3e91760cbb34',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  rome: 'photo-1552832230-c0197dd311b5',
  london: 'photo-1513635269975-59663e0ac1ad',
  'new york': 'photo-1496442226666-8d4d0e62e6e9',
  bali: 'photo-1537996194471-e657df975ab4',
  dubai: 'photo-1512453979798-5ea266f8880c',
  goa: 'photo-1512343879784-a960bf40e7f2',
  manali: 'photo-1626621341517-bbf3d9990a23',
  jaipur: 'photo-1477587458883-47145ed94245',
  kerala: 'photo-1506905925346-21bda4d32df4',
  singapore: 'photo-1525625293386-3f8f99389edd',
  bangkok: 'photo-1508009603885-50cf7c579365',
  maldives: 'photo-1514282401047-d79a71a590e8',
  istanbul: 'photo-1524231757912-21f4fe3a7200',
  barcelona: 'photo-1539037116277-4db20889f2d4',
  kyoto: 'photo-1493976040374-85c8e12f0c0e',
  mumbai: 'photo-1570168007204-dfb528c6958f',
  delhi: 'photo-1587474260584-136574528ed5',
  agra: 'photo-1564507592333-c60657eea523',
  varanasi: 'photo-1561361058-c24e01238a46',
  rishikesh: 'photo-1506905925346-21bda4d32df4',
  shimla: 'photo-1626621341517-bbf3d9990a23',
  default: 'photo-1469474968028-56623f02e42e',
};

export const getDestImage = (destination = '', w = 800, h = 500) => {
  const d = destination.toLowerCase();
  for (const [key, id] of Object.entries(DEST_IMAGES)) {
    if (key !== 'default' && d.includes(key)) {
      return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;
    }
  }
  return `https://images.unsplash.com/${DEST_IMAGES.default}?w=${w}&h=${h}&fit=crop&q=80`;
};

export const generateTripPlan = async (destination, startDate, endDate, days, preferences = '') => {
  try {
    if (!API_KEY) throw new Error('Gemini API key missing');

    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    const refData = buildReferencePrompt(destination);
    console.log('📍 Reference data found:', refData ? 'YES' : 'NO - will use Gemini knowledge');
    console.log('📍 Destination input:', destination);

    const prompt = `You are an expert travel planner. Create a ${days}-day itinerary for ${destination}.

CRITICAL: Return ONLY raw JSON. No markdown, no explanation, no code blocks.

STRICT RULES:
- NEVER use generic names like "Local Restaurant", "Tourist Area", "Popular Eatery", "Nearby Market", "Well-known restaurant", "Famous Attraction", "City Center"
- Use ONLY real specific names: actual restaurant names, real hotel names, real landmark names
- Day 1: start with arrival at real airport name
- Last day: end with departure
- Hotel must be a real named hotel
${refData ? refData : `- Use your knowledge of real places in ${destination} — real hotels, restaurants, landmarks`}

JSON FORMAT (generate all ${days} days):
{
  "destination": "${destination}",
  "duration": "${days} days",
  "dates": "${startDate} to ${endDate}",
  "overview": "2-3 sentences about ${destination}",
  "highlights": ["place1", "place2", "place3", "place4", "place5"],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival in ${destination}",
      "schedule": [
        { "time": "10:00 AM", "activity": "Arrive at [REAL AIRPORT NAME]", "detail": "Check in to hotel, freshen up.", "cost": "\u20b9600" },
        { "time": "01:00 PM", "activity": "Lunch at [REAL RESTAURANT NAME]", "detail": "Try [real dish name].", "cost": "\u20b9400-700" },
        { "time": "03:00 PM", "activity": "Visit [REAL PLACE NAME]", "detail": "[what to see/do there]", "cost": "\u20b9100-300" },
        { "time": "06:00 PM", "activity": "[REAL EVENING SPOT]", "detail": "[experience]", "cost": "\u20b9200" },
        { "time": "08:00 PM", "activity": "Dinner at [REAL RESTAURANT]", "detail": "Try [real dish].", "cost": "\u20b9500-900" }
      ],
      "hotel": "[REAL HOTEL NAME], [area]",
      "dailyCost": "\u20b94000-8000",
      "tip": "[practical tip for this day]"
    }
  ],
  "mustEat": ["dish1 at restaurant1", "dish2", "dish3", "dish4", "dish5"],
  "mustBuy": ["item1 from market1", "item2", "item3"],
  "budgetEstimate": {
    "accommodation": "\u20b92000-8000/night",
    "food": "\u20b91200-3000/day",
    "activities": "\u20b93000-12000 total",
    "transportation": "\u20b92000-6000 total",
    "total": "\u20b9${Math.round(parseInt(days) * 4000)}-\u20b9${Math.round(parseInt(days) * 12000)}"
  },
  "travelTips": ["tip1", "tip2", "tip3"],
  "bestTimeToVisit": "[months and reason]",
  "emergencyNumbers": "Police: 100, Ambulance: 108"
}

User preferences: ${preferences || 'standard comfortable travel'}
Generate ALL ${days} days. Every place name must be REAL and SPECIFIC.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('🔍 Gemini raw response:', text.substring(0, 300));

    // Parse JSON — strip markdown if present
    const clean = text.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      // Try to fix common JSON issues
      const fixed = jsonMatch[0].replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      parsed = JSON.parse(fixed);
    }

    // Add images
    const img = getDestImage(destination);
    parsed.heroImage = { primary: img, thumbnail: img, fallback: img };

    console.log('✅ Trip plan generated:', destination);
    return parsed;

  } catch (error) {
    console.error('Trip generation error:', error.message || error);
    console.error('Full error:', error);
    return createFallbackResponse(destination, startDate, endDate, days);
  }
};

const createFallbackResponse = (destination, startDate, endDate, days) => {
  const img = getDestImage(destination);
  const daysNum = parseInt(days) || 3;

  const dailyItinerary = Array.from({ length: daysNum }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    return {
      day: i + 1,
      date: dateStr,
      title: i === 0 ? 'Arrival & First Exploration'
        : i === daysNum - 1 ? 'Final Day & Departure'
        : `Day ${i + 1} — Exploring ${destination}`,
      schedule: [
        {
          time: '09:00 AM',
          activity: i === 0 ? `Arrive at ${destination} Airport` : `Morning sightseeing in ${destination}`,
          detail: i === 0 ? `Take a prepaid taxi to your hotel` : `Explore the local area and markets`,
          cost: i === 0 ? '₹800' : '₹0',
        },
        {
          time: '12:30 PM',
          activity: `Lunch at a popular local eatery`,
          detail: `Try regional specialties of ${destination}`,
          cost: '₹400-800',
        },
        {
          time: '02:00 PM',
          activity: `Visit main attractions of ${destination}`,
          detail: `Explore the iconic sights and cultural spots`,
          cost: '₹200-1000',
        },
        {
          time: '07:30 PM',
          activity: `Dinner at a well-known restaurant`,
          detail: `Enjoy the local cuisine and flavours`,
          cost: '₹500-1200',
        },
      ],
      hotel: `A comfortable hotel in ${destination}`,
      dailyCost: '₹4000-8000',
    };
  });

  return {
    destination,
    duration: `${days} days`,
    dates: `${startDate} to ${endDate}`,
    overview: `${destination} is an amazing destination with rich culture, stunning landscapes, and unforgettable experiences. This ${days}-day itinerary covers the best of what ${destination} has to offer.`,
    highlights: [
      `Explore the iconic landmarks of ${destination}`,
      `Experience authentic local cuisine and culture`,
      `Visit historical sites and museums`,
      `Discover scenic viewpoints and natural beauty`,
    ],
    dailyItinerary,
    budgetEstimate: {
      accommodation: '₹2000-8000 per night',
      food: '₹1500-3000 per day',
      activities: '₹5000-15000 total',
      transportation: '₹3000-8000 total',
      total: `₹${Math.round(daysNum * 4000)}-₹${Math.round(daysNum * 12000)} for entire trip`,
    },
    travelTips: [
      `Book accommodations in ${destination} in advance`,
      'Carry local currency for small purchases',
      'Use local transport to save money',
      'Keep copies of all important documents',
      'Research local customs before visiting',
    ],
    packingList: [
      'Comfortable walking shoes',
      'Weather-appropriate clothing',
      'Camera and power bank',
      'Travel documents',
      'Basic medicines',
    ],
    bestTimeToVisit: `Research ${destination} weather for best travel months`,
    localCurrency: 'Check current exchange rates',
    language: 'Check local language and download translation app',
    heroImage: { primary: getDestImage(destination), thumbnail: getDestImage(destination), fallback: getDestImage(destination) },
  };
};

export const generateTripSummary = (tripData) => {
  return `🌟 *AI Travel Plan — ${tripData.destination}* 🌟

📅 *Duration:* ${tripData.duration}
📆 *Dates:* ${tripData.dates}

✨ *Overview:*
${tripData.overview}

🎯 *Top Highlights:*
${tripData.highlights?.map(h => `• ${h}`).join('\n') || 'Amazing experiences await!'}

💰 *Budget:* ${tripData.budgetEstimate?.total || 'See full plan'}

Generated by AI Travel Planner ✈️`;
};
