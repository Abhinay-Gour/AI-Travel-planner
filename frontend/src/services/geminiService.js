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

IMPORTANT RULES:
- Use ONLY real, existing places with actual names
- Include airport name, real hotel areas, real restaurants, real attractions
- All costs in Indian Rupees (₹)
- Times should be realistic (not too rushed)
- Include breakfast, lunch, dinner for each day
- Day 1 starts with airport arrival
- Last day ends with airport departure

Return ONLY valid JSON (no markdown, no extra text):

{
  "destination": "${destination}",
  "duration": "${days} days",
  "dates": "${startDate} to ${endDate}",
  "overview": "2-3 sentences about why ${destination} is amazing to visit",
  "highlights": [
    "Real famous place 1 - brief description",
    "Real famous place 2 - brief description",
    "Real famous place 3 - brief description",
    "Real famous place 4 - brief description"
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "title": "Arrival & First Exploration",
      "activities": [
        {
          "time": "10:00 AM",
          "activity": "Arrive at [REAL AIRPORT NAME]",
          "description": "Land at airport, clear immigration, collect baggage. Take [metro/taxi/bus] to hotel area.",
          "location": "[Real airport name], [City]",
          "duration": "2 hours",
          "cost": "₹800 (taxi to hotel)",
          "tips": "Book airport taxi in advance to avoid overcharging"
        },
        {
          "time": "12:30 PM",
          "activity": "Hotel Check-in & Freshen Up",
          "description": "Check into hotel in [REAL NEIGHBORHOOD]. Rest and freshen up after journey.",
          "location": "[Real neighborhood/area name]",
          "duration": "1 hour",
          "cost": "₹3000-8000/night"
        },
        {
          "time": "02:00 PM",
          "activity": "Lunch at [REAL LOCAL RESTAURANT/AREA]",
          "description": "Try authentic local cuisine. Must try: [specific local dish names]",
          "location": "[Real restaurant area or market name]",
          "duration": "1 hour",
          "cost": "₹400-800 per person"
        },
        {
          "time": "03:30 PM",
          "activity": "Visit [REAL FAMOUS LANDMARK]",
          "description": "[What makes this place special, history, what to see there]",
          "location": "[Real address or area]",
          "duration": "2-3 hours",
          "cost": "₹500-1500 entry",
          "tips": "[Specific tip for this place]"
        },
        {
          "time": "07:00 PM",
          "activity": "Dinner at [REAL RESTAURANT AREA]",
          "description": "Evening dinner with local specialties. [Specific food recommendations]",
          "location": "[Real area name]",
          "duration": "1.5 hours",
          "cost": "₹600-1200 per person"
        }
      ],
      "meals": {
        "breakfast": "Hotel breakfast or [specific local breakfast place]",
        "lunch": "[Real restaurant or food area name]",
        "dinner": "[Real restaurant area or specific restaurant]"
      },
      "accommodation": "Stay in [real neighborhood] - good location for sightseeing",
      "dailyCost": "₹5000-8000 per person"
    }
  ],
  "budgetEstimate": {
    "accommodation": "₹2000-8000 per night",
    "food": "₹1500-3000 per day",
    "activities": "₹5000-15000 total",
    "transportation": "₹3000-8000 total",
    "total": "₹${Math.round(days * 4000)}-₹${Math.round(days * 12000)} for entire trip"
  },
  "travelTips": [
    "Specific tip about ${destination} transport",
    "Cultural tip specific to ${destination}",
    "Best time to visit specific attractions",
    "Money/payment tip for ${destination}",
    "Safety tip for ${destination}"
  ],
  "packingList": [
    "Weather-appropriate clothing for ${destination}",
    "Comfortable walking shoes",
    "Camera and power bank",
    "Travel documents and copies",
    "Basic medicines and first aid"
  ],
  "bestTimeToVisit": "Specific months and why for ${destination}",
  "localCurrency": "Currency name and exchange rate from INR",
  "language": "Local language and useful phrases",
  "emergencyNumbers": "Police: [number], Ambulance: [number], Tourist helpline: [number]"
}

Generate ALL ${days} days in dailyItinerary array with REAL places for ${destination}.
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
