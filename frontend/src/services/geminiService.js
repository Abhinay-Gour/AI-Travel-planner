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

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day trip itinerary for ${destination}.

STRICT RULES:
1. ALL place names must be 100% real and specific — NO generic names like "Local Restaurant", "Tourist Area", "Famous Attraction", "City Center"
2. Use actual named restaurants, hotels, landmarks, markets
3. Write in English only
4. Each day has a narrative schedule: morning activity, lunch at named place, afternoon activity, dinner at named place
5. Day 1 must start with arrival at the real airport name
6. Last day must end with departure from real airport

KASHMIR REFERENCE (use these exact names):
- Airport: Sheikh ul-Alam International Airport, Srinagar
- Hotels: The Lalit Grand Palace, Vivanta Dal View, Houseboat on Dal Lake, Hotel Broadway, Grand Mumtaz Resort
- Restaurants: Ahdoos Restaurant, Mughal Darbar, Shamyana Restaurant, Lhasa Restaurant, Adhoos
- Places: Dal Lake, Nagin Lake, Shalimar Bagh, Nishat Bagh, Chashme Shahi, Shankaracharya Temple, Hazratbal Mosque, Lal Chowk, Polo View Market, Boulevard Road, Pari Mahal, Dachigam National Park, Gulmarg, Gondola Cable Car, Apharwat Peak, Pahalgam, Betaab Valley, Aru Valley, Lidder River, Baisaran Valley, Sonamarg, Thajiwas Glacier, Zero Point
- Food: Rogan Josh, Wazwan, Gushtaba, Yakhni, Dum Aloo Kashmiri, Kashmiri Kahwa, Sheer Chai, Modur Pulao
- Shopping: Pashmina shawls, Kashmiri saffron, dry fruits, walnut wood handicrafts, Kashmiri carpets, papier-mache items from Lal Chowk or Polo View Market

Return ONLY valid JSON, no markdown:

{
  "destination": "${destination}",
  "duration": "${days} days",
  "dates": "${startDate} to ${endDate}",
  "overview": "2-3 sentences about ${destination}",
  "highlights": ["real place 1", "real place 2", "real place 3", "real place 4", "real place 5"],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival in [City]",
      "schedule": [
        { "time": "10:00 AM", "activity": "Arrive at [REAL AIRPORT NAME]", "detail": "Take a prepaid cab to hotel. Journey takes about 30 minutes.", "cost": "₹600" },
        { "time": "12:00 PM", "activity": "Lunch at [REAL RESTAURANT NAME]", "detail": "Try [specific real dish name]. This restaurant is known for authentic local cuisine.", "cost": "₹400-700 per person" },
        { "time": "02:00 PM", "activity": "Visit [REAL PLACE NAME]", "detail": "[What to see and do there specifically]", "cost": "₹50-200 entry" },
        { "time": "05:00 PM", "activity": "[REAL EVENING PLACE/ACTIVITY]", "detail": "[Specific experience]", "cost": "₹200-500" },
        { "time": "08:00 PM", "activity": "Dinner at [REAL RESTAURANT NAME]", "detail": "Must try [specific dish]. [Why this restaurant is special]", "cost": "₹500-900 per person" }
      ],
      "hotel": "[REAL HOTEL NAME], [area/location]",
      "dailyCost": "₹4000-8000 per person",
      "tip": "[One specific practical tip for this day]"
    }
  ],
  "mustEat": ["Dish 1 — where to try it", "Dish 2 — where to try it", "Dish 3", "Dish 4", "Dish 5"],
  "mustBuy": ["Item 1 — where to buy", "Item 2 — where to buy", "Item 3", "Item 4"],
  "budgetEstimate": {
    "accommodation": "₹2000-8000 per night",
    "food": "₹1200-3000 per day",
    "activities": "₹3000-12000 total",
    "transportation": "₹2000-6000 total",
    "shopping": "₹2000-10000 (optional)",
    "total": "₹${Math.round(parseInt(days) * 4000)}-₹${Math.round(parseInt(days) * 12000)} for entire trip"
  },
  "travelTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "bestTimeToVisit": "[specific months and reason]",
  "emergencyNumbers": "Police: 100, Ambulance: 108, Tourist Helpline: 1800-111-363"
}

Generate ALL ${days} days in dailyItinerary. Every schedule item must use a REAL named place. No generic names allowed.
User preferences: ${preferences || 'standard comfortable travel'}`;

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
