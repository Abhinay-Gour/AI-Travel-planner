import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const prompt = `You are an expert travel planner with deep knowledge of every destination worldwide. Create a highly detailed ${days}-day trip itinerary for ${destination}.

CRITICAL RULES — MUST FOLLOW:
1. Use ONLY 100% real, existing, named places — NO generic names like "Local Restaurant" or "Tourist Area"
2. For Kashmir: use Srinagar, Dal Lake, Gulmarg, Pahalgam, Sonamarg, Shankaracharya Temple, Hazratbal Mosque, Mughal Gardens (Shalimar Bagh, Nishat Bagh, Chashme Shahi), Lal Chowk, Boulevard Road, Dachigam National Park, Betaab Valley, Aru Valley, Baisaran (Mini Switzerland), Zero Point, Apharwat Peak, Gondola Cable Car, Wular Lake, Nagin Lake, Pari Mahal, etc.
3. For every destination, name the ACTUAL airport (e.g. Sheikh ul-Alam International Airport for Srinagar, Indira Gandhi International for Delhi)
4. Name REAL hotels/areas (e.g. Houseboat on Dal Lake, The Lalit Grand Palace Srinagar, Hotel Broadway)
5. Name REAL restaurants and local food (e.g. Ahdoos Restaurant, Mughal Darbar, Shamyana for Kashmiri Wazwan)
6. Name REAL markets (e.g. Lal Chowk, Polo View Market, Residency Road for Kashmir)
7. All costs in Indian Rupees (₹)
8. Realistic timings with proper travel time between places
9. Day 1: airport arrival → hotel check-in → nearby exploration
10. Last day: morning sightseeing → airport departure

Return ONLY valid JSON (no markdown, no extra text):

{
  "destination": "${destination}",
  "duration": "${days} days",
  "dates": "${startDate} to ${endDate}",
  "overview": "2-3 compelling sentences about ${destination} with specific details",
  "highlights": [
    "[REAL PLACE NAME] — specific reason to visit",
    "[REAL PLACE NAME] — specific reason to visit",
    "[REAL PLACE NAME] — specific reason to visit",
    "[REAL PLACE NAME] — specific reason to visit",
    "[REAL PLACE NAME] — specific reason to visit"
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival & First Exploration",
      "activities": [
        {
          "time": "10:00 AM",
          "activity": "Arrive at [ACTUAL AIRPORT NAME]",
          "description": "Detailed arrival instructions, transport options with prices",
          "location": "[Actual airport full name], [City]",
          "duration": "1.5 hours",
          "cost": "₹600-1200 (taxi/cab to hotel)"
        },
        {
          "time": "12:00 PM",
          "activity": "Check-in at [REAL HOTEL/AREA NAME]",
          "description": "Check into hotel. Freshen up. Brief area orientation.",
          "location": "[Real neighborhood — e.g. Dal Lake Boulevard, Srinagar]",
          "duration": "1 hour",
          "cost": "₹2500-8000/night"
        },
        {
          "time": "01:30 PM",
          "activity": "Lunch at [REAL RESTAURANT NAME]",
          "description": "Try [specific local dishes]. [Restaurant known for what]",
          "location": "[Real restaurant name & area]",
          "duration": "1 hour",
          "cost": "₹400-900 per person"
        },
        {
          "time": "03:00 PM",
          "activity": "Visit [REAL LANDMARK NAME]",
          "description": "[History, what to see, best photo spots, insider tips]",
          "location": "[Real address/area]",
          "duration": "2 hours",
          "cost": "₹50-500 entry"
        },
        {
          "time": "06:30 PM",
          "activity": "[REAL EVENING ACTIVITY/PLACE]",
          "description": "[Specific evening experience at this destination]",
          "location": "[Real place name]",
          "duration": "1.5 hours",
          "cost": "₹200-600"
        },
        {
          "time": "08:00 PM",
          "activity": "Dinner at [REAL RESTAURANT NAME]",
          "description": "[Specific dishes to try, ambiance, specialty]",
          "location": "[Real restaurant/area name]",
          "duration": "1.5 hours",
          "cost": "₹500-1200 per person"
        }
      ],
      "meals": {
        "breakfast": "[Real breakfast place or hotel name]",
        "lunch": "[Real restaurant name]",
        "dinner": "[Real restaurant name]"
      },
      "accommodation": "[Real hotel name or area] — [why good location]",
      "dailyCost": "₹4000-9000 per person"
    }
  ],
  "budgetEstimate": {
    "accommodation": "₹2000-8000 per night",
    "food": "₹1200-3000 per day",
    "activities": "₹3000-12000 total",
    "transportation": "₹2000-6000 total",
    "shopping": "₹2000-10000 (optional)",
    "total": "₹${Math.round(days * 4000)}-₹${Math.round(days * 12000)} for entire trip"
  },
  "travelTips": [
    "[Specific transport tip for ${destination}]",
    "[Cultural/etiquette tip specific to ${destination}]",
    "[Best time to visit key attractions]",
    "[Local food must-try tip]",
    "[Safety/practical tip for ${destination}]"
  ],
  "bestTimeToVisit": "[Specific months and weather for ${destination}]",
  "localCurrency": "[Currency and payment tips]",
  "language": "[Local language and 3-4 useful phrases]",
  "emergencyNumbers": "Police: 100, Ambulance: 108, Tourist Helpline: 1800-111-363"
}

Generate ALL ${days} days with REAL, SPECIFIC place names for ${destination}. Every activity must have a real named location.
Additional preferences: ${preferences || 'Standard comfortable travel'}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);

    // Add images
    const img = getDestImage(destination);
    parsed.heroImage = { primary: img, thumbnail: img, fallback: img };

    console.log('✅ Trip plan generated:', destination);
    return parsed;

  } catch (error) {
    console.error('Trip generation error:', error);
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
      activities: [
        {
          time: '09:00 AM',
          activity: i === 0 ? `Arrive at ${destination} Airport` : `Morning at ${destination}`,
          description: i === 0
            ? `Land at airport, take taxi/metro to hotel in city center`
            : `Start your day exploring the best of ${destination}`,
          location: i === 0 ? `${destination} International Airport` : `${destination} City Center`,
          duration: '2 hours',
          cost: i === 0 ? '₹800 (taxi)' : '₹0',
        },
        {
          time: '12:00 PM',
          activity: `Lunch — Local ${destination} Cuisine`,
          description: `Try authentic local food and specialties of ${destination}`,
          location: `Local restaurant in ${destination}`,
          duration: '1 hour',
          cost: '₹500-800',
        },
        {
          time: '02:00 PM',
          activity: `Visit Famous Attractions of ${destination}`,
          description: `Explore the most iconic landmarks and attractions`,
          location: `${destination} Tourist Area`,
          duration: '3 hours',
          cost: '₹500-1500',
        },
        {
          time: '07:00 PM',
          activity: `Dinner & Evening in ${destination}`,
          description: `Enjoy local dinner and evening atmosphere`,
          location: `${destination} Restaurant District`,
          duration: '2 hours',
          cost: '₹600-1200',
        },
      ],
      meals: {
        breakfast: 'Hotel breakfast',
        lunch: `Local ${destination} restaurant`,
        dinner: `${destination} dining area`,
      },
      accommodation: `Hotel in ${destination} city center`,
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
