import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Curated static Unsplash image IDs — always work, no API needed
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
  default: 'photo-1469474968028-56623f02e42e',
};

const getDestImage = (destination = '', w = 800, h = 600) => {
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
    if (!API_KEY) throw new Error('API key not configured. Please check your .env file.');

    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}.

IMPORTANT: Include REAL, FAMOUS, and SPECIFIC locations with detailed descriptions.

Destination: ${destination}
Duration: ${days} days
Dates: ${startDate} to ${endDate}

Overview: [Brief 2-3 sentence overview]

Highlights:
- [Real famous landmark 1]
- [Real famous landmark 2]
- [Real famous landmark 3]
- [Real famous landmark 4]

Daily Itinerary:

Day 1 (${startDate}) - Arrival & City Center Exploration
- 09:00 AM: [Activity] ($cost)
  Location: [Real address]
  Why Visit: [Description]
- 02:00 PM: [Activity] ($cost)
- 07:00 PM: Dinner at [Restaurant area] ($cost)
Meals: [breakfast, lunch, dinner]
Accommodation: [Hotel area]

[Continue for all ${days} days]

Budget Estimate:
- Accommodation: $80-150 per night
- Food: $40-80 per day
- Activities: $200-400 total
- Transportation: $100-200 total
- Total: $800-1500 for entire trip

Travel Tips:
- [Tip 1]
- [Tip 2]
- [Tip 3]

Packing List:
- [Item 1]
- [Item 2]

Best Time to Visit: [Info]
Local Currency: [Currency]
Language: [Language]

Additional preferences: ${preferences || 'Standard travel experience with authentic local experiences'}`;

    console.log('Generating trip plan for:', destination);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('AI Response received successfully');

    const parsedData = parseTextResponseWithLocations(text, destination, startDate, endDate, days);
    console.log('✅ Trip plan generated successfully!');
    return parsedData;

  } catch (error) {
    console.error('Error generating trip plan:', error);
    return createEnhancedFallbackResponse(destination, startDate, endDate, days);
  }
};

const parseTextResponseWithLocations = (text, destination, startDate, endDate, days) => {
  try {
    const overviewMatch = text.match(/Overview:\s*([^\n]+(?:\n[^\n]*)*?)(?=\n\n|Highlights:|$)/i);
    const highlightsMatch = text.match(/Highlights:\s*([\s\S]*?)(?=\n\nDaily Itinerary:|Daily Itinerary:|Budget Estimate:|$)/i);
    const tipsMatch = text.match(/Travel Tips:\s*([\s\S]*?)(?=\n\nPacking List:|Packing List:|$)/i);
    const dailyMatch = text.match(/Daily Itinerary:\s*([\s\S]*?)(?=\n\nBudget Estimate:|Budget Estimate:|$)/i);

    const highlights = highlightsMatch
      ? highlightsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean)
      : [];

    const travelTips = tipsMatch
      ? tipsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean)
      : [];

    const dailyItinerary = parseDailyItineraryWithLocations(dailyMatch ? dailyMatch[1] : '', days, startDate, destination);
    const img = getDestImage(destination, 800, 400);

    return {
      destination,
      duration: `${days} days`,
      dates: `${startDate} to ${endDate}`,
      overview: overviewMatch ? overviewMatch[1].trim() : `Exciting ${days}-day adventure in ${destination}.`,
      highlights: highlights.length > 0 ? highlights : getDefaultHighlights(destination),
      dailyItinerary,
      budgetEstimate: {
        accommodation: '$80 - $150 per night',
        food: '$40 - $80 per day',
        activities: '$200 - $400 total',
        transportation: '$100 - $200 total',
        total: `$${400 + days * 60} - $${600 + days * 120} for entire trip`
      },
      travelTips: travelTips.length > 0 ? travelTips : getDefaultTips(destination),
      packingList: getDestinationPackingList(),
      bestTimeToVisit: `Check ${destination} weather patterns for optimal timing`,
      localCurrency: getCurrencyInfo(destination),
      language: getLanguageInfo(destination),
      heroImage: { primary: img, thumbnail: img, fallback: img },
      highlightImages: (highlights.length > 0 ? highlights : getDefaultHighlights(destination)).reduce((acc, _, i) => {
        acc[i] = { primary: img, thumbnail: img, fallback: img };
        return acc;
      }, {}),
      rawResponse: text
    };
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    return createEnhancedFallbackResponse(destination, startDate, endDate, days);
  }
};

const parseDailyItineraryWithLocations = (dailyText, days, startDate, destination) => {
  const itinerary = [];
  const start = new Date(startDate);
  const dayMatches = dailyText.match(/Day \d+[\s\S]*?(?=Day \d+|$)/gi) || [];

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dayMatches[i] ? parseSingleDay(dayMatches[i], i + 1, dateStr, destination) : null;
    itinerary.push(dayData || generateEnhancedFallbackDay(i + 1, dateStr, destination, days));
  }
  return itinerary;
};

const parseSingleDay = (dayText, dayNumber, date, destination) => {
  try {
    const titleMatch = dayText.match(/Day \d+[^\n]*?-\s*([^\n]+)/i);
    const timeMatches = dayText.match(/\d{1,2}:\d{2}\s*[AP]M[\s\S]*?(?=\d{1,2}:\d{2}\s*[AP]M|Meals:|Accommodation:|$)/gi) || [];
    const img = getDestImage(destination, 800, 600);

    const activities = timeMatches.map(block => {
      const timeMatch = block.match(/(\d{1,2}:\d{2}\s*[AP]M)/);
      const activityMatch = block.match(/[AP]M[:\s]*([^\n]+)/);
      const locationMatch = block.match(/Location:\s*([^\n]+)/i);
      const whyMatch = block.match(/Why Visit:\s*([^\n]+)/i);
      const costMatch = block.match(/\$(\d+(?:-\d+)?)/);
      if (!timeMatch || !activityMatch) return null;
      return {
        time: timeMatch[1],
        activity: activityMatch[1].trim(),
        location: locationMatch ? locationMatch[1].trim() : 'City center',
        description: whyMatch ? whyMatch[1].trim() : 'Exciting local experience',
        duration: '2-3 hours',
        cost: costMatch ? `$${costMatch[1]}` : '$30-50',
        image: img,
        realImage: { primary: img, thumbnail: img, fallback: img }
      };
    }).filter(Boolean);

    return {
      day: dayNumber, date,
      title: titleMatch ? titleMatch[1].trim() : `Day ${dayNumber} Adventures`,
      activities,
      meals: { breakfast: 'Local café or hotel breakfast', lunch: 'Traditional restaurant', dinner: 'Recommended dining experience' },
      accommodation: 'Comfortable hotel in prime location'
    };
  } catch {
    return null;
  }
};

const getDefaultHighlights = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris')) return ['Eiffel Tower - Iconic iron lattice tower', "Louvre Museum - World's largest art museum", 'Notre-Dame Cathedral - Gothic masterpiece', 'Champs-Élysées - Famous shopping avenue'];
  if (city.includes('tokyo')) return ['Senso-ji Temple - Ancient Buddhist temple', "Shibuya Crossing - World's busiest crossing", 'Tokyo Skytree - Tallest structure in Japan', 'Tsukiji Outer Market - Fresh seafood paradise'];
  if (city.includes('rome')) return ['Colosseum - Ancient gladiator arena', "Vatican City - St. Peter's Basilica", 'Trevi Fountain - Baroque masterpiece', 'Roman Forum - Ancient ruins'];
  if (city.includes('london')) return ['Big Ben & Houses of Parliament', 'Tower Bridge - Victorian bascule bridge', 'British Museum - World-class artifacts', 'Buckingham Palace - Royal residence'];
  if (city.includes('new york')) return ['Statue of Liberty - Symbol of freedom', 'Central Park - Urban oasis in Manhattan', 'Times Square - Bright lights & Broadway', 'Empire State Building - Art Deco skyscraper'];
  if (city.includes('dubai')) return ['Burj Khalifa - World\'s tallest building', 'Dubai Mall - Largest shopping mall', 'Palm Jumeirah - Iconic artificial island', 'Dubai Creek - Historic waterway'];
  if (city.includes('goa')) return ['Baga Beach - Famous party beach', 'Old Goa Churches - UNESCO heritage', 'Dudhsagar Falls - Stunning waterfall', 'Anjuna Flea Market - Vibrant bazaar'];
  return [
    `Explore the main attractions of ${destination}`,
    'Experience authentic local cuisine and culture',
    'Visit historical landmarks and museums',
    'Discover scenic viewpoints and photo opportunities'
  ];
};

const getDefaultTips = (destination) => [
  `Book accommodations in ${destination} in advance for better rates`,
  'Try local transportation to experience the city like a local',
  'Learn basic local phrases to enhance your cultural experience',
  'Keep copies of important documents in separate locations',
  'Research local customs and etiquette before visiting'
];

const getDestinationPackingList = () => [
  'Comfortable walking shoes for sightseeing',
  'Weather-appropriate clothing layers',
  'Camera and portable chargers',
  'Travel documents and emergency contacts',
  'Basic first aid kit and personal medications',
  'Universal power adapter',
  'Guidebook or offline maps app'
];

const getCurrencyInfo = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris') || city.includes('france')) return 'Euro (EUR)';
  if (city.includes('tokyo') || city.includes('japan')) return 'Japanese Yen (JPY)';
  if (city.includes('london') || city.includes('uk')) return 'British Pound (GBP)';
  if (city.includes('new york') || city.includes('usa')) return 'US Dollar (USD)';
  if (city.includes('dubai') || city.includes('uae')) return 'UAE Dirham (AED)';
  if (city.includes('india') || city.includes('delhi') || city.includes('mumbai') || city.includes('goa') || city.includes('jaipur')) return 'Indian Rupee (INR)';
  return 'Check local currency and exchange rates';
};

const getLanguageInfo = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris') || city.includes('france')) return 'French (English widely spoken in tourist areas)';
  if (city.includes('tokyo') || city.includes('japan')) return 'Japanese (English in major tourist areas)';
  if (city.includes('london') || city.includes('uk')) return 'English';
  if (city.includes('rome') || city.includes('italy')) return 'Italian (English in tourist areas)';
  if (city.includes('dubai') || city.includes('uae')) return 'Arabic (English widely spoken)';
  return 'Check local language and download translation apps';
};

const createEnhancedFallbackResponse = (destination, startDate, endDate, days) => {
  console.log('Creating fallback response for:', destination);
  const img = getDestImage(destination, 800, 400);
  return {
    destination,
    duration: `${days} days`,
    dates: `${startDate} to ${endDate}`,
    overview: `Exciting ${days}-day adventure in ${destination} with carefully planned activities, authentic local experiences, and cultural immersion.`,
    highlights: getDefaultHighlights(destination),
    dailyItinerary: generateEnhancedFallbackItinerary(days, startDate, destination),
    budgetEstimate: {
      accommodation: '$80 - $150 per night',
      food: '$40 - $80 per day',
      activities: '$200 - $400 total',
      transportation: '$100 - $200 total',
      total: `$${400 + days * 60} - $${600 + days * 120} for entire trip`
    },
    travelTips: getDefaultTips(destination),
    packingList: getDestinationPackingList(),
    bestTimeToVisit: `Research ${destination} weather patterns for optimal timing`,
    localCurrency: getCurrencyInfo(destination),
    language: getLanguageInfo(destination),
    heroImage: { primary: img, thumbnail: img, fallback: img },
    highlightImages: getDefaultHighlights(destination).reduce((acc, _, i) => {
      acc[i] = { primary: img, thumbnail: img, fallback: img };
      return acc;
    }, {}),
    generatedBy: 'AI Travel Planner Fallback System'
  };
};

const generateEnhancedFallbackItinerary = (days, startDate, destination) => {
  const start = new Date(startDate);
  const locationData = getDestinationLocationData(destination);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return generateEnhancedFallbackDay(i + 1, d.toISOString().split('T')[0], destination, days, locationData);
  });
};

const generateEnhancedFallbackDay = (dayNumber, date, destination, totalDays, locationData = null) => {
  if (!locationData) locationData = getDestinationLocationData(destination);
  const dayTitle = dayNumber === 1 ? 'Arrival & City Exploration'
    : dayNumber === totalDays ? 'Final Day & Departure'
    : `${destination} Discovery Day ${dayNumber}`;
  const locs = locationData.activities.slice((dayNumber - 1) * 3, dayNumber * 3);
  const img = getDestImage(destination, 800, 600);

  return {
    day: dayNumber, date, title: dayTitle,
    activities: [
      { time: '09:00 AM', activity: locs[0]?.name || `Explore ${destination} city center`, description: locs[0]?.description || 'Start your day with exciting exploration', location: locs[0]?.location || 'City center area', duration: '2-3 hours', cost: '$30-50', image: img, realImage: { primary: img, thumbnail: img, fallback: img } },
      { time: '02:00 PM', activity: locs[1]?.name || `Visit ${destination} attractions`, description: locs[1]?.description || 'Afternoon cultural and sightseeing activities', location: locs[1]?.location || 'Main tourist area', duration: '3-4 hours', cost: '$40-60', image: img, realImage: { primary: img, thumbnail: img, fallback: img } },
      { time: '07:00 PM', activity: locs[2]?.name || `${destination} evening experience`, description: locs[2]?.description || 'Evening relaxation and local experiences', location: locs[2]?.location || 'Entertainment district', duration: '2-3 hours', cost: '$35-55', image: img, realImage: { primary: img, thumbnail: img, fallback: img } }
    ],
    meals: {
      breakfast: `Local café or hotel breakfast in ${destination}`,
      lunch: `Traditional ${destination} restaurant with local specialties`,
      dinner: `Recommended ${destination} dining experience`
    },
    accommodation: `Comfortable hotel in prime ${destination} location`
  };
};

const getDestinationLocationData = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris')) return { activities: [
    { name: 'Eiffel Tower visit', description: 'Iconic iron lattice tower with panoramic city views', location: 'Champ de Mars, 7th arrondissement' },
    { name: 'Louvre Museum tour', description: "World's largest art museum featuring the Mona Lisa", location: 'Rue de Rivoli, 1st arrondissement' },
    { name: 'Seine River cruise', description: "Romantic boat ride along Paris's historic river", location: 'Port de la Bourdonnais' },
    { name: 'Notre-Dame Cathedral', description: 'Gothic masterpiece on Île de la Cité', location: 'Île de la Cité, 4th arrondissement' },
    { name: 'Champs-Élysées stroll', description: 'Famous avenue for shopping and people-watching', location: '8th arrondissement' },
    { name: 'Montmartre exploration', description: 'Artistic hilltop district with Sacré-Cœur Basilica', location: '18th arrondissement' },
    { name: 'Latin Quarter dining', description: 'Historic neighborhood with cozy bistros', location: '5th arrondissement' },
    { name: 'Versailles Palace', description: 'Opulent royal palace with magnificent gardens', location: 'Versailles (day trip)' },
    { name: 'Marais district walk', description: 'Trendy area with boutiques and galleries', location: '3rd and 4th arrondissements' },
    { name: 'Arc de Triomphe', description: 'Triumphal arch at Place Charles de Gaulle', location: 'Place Charles de Gaulle' }
  ]};
  if (city.includes('tokyo')) return { activities: [
    { name: 'Senso-ji Temple visit', description: 'Ancient Buddhist temple in Asakusa district', location: 'Asakusa, Taito City' },
    { name: 'Shibuya Crossing experience', description: "World's busiest pedestrian crossing", location: 'Shibuya district' },
    { name: 'Tokyo Skytree ascent', description: 'Tallest structure in Japan with breathtaking views', location: 'Sumida City' },
    { name: 'Tsukiji Outer Market', description: 'Fresh seafood and street food paradise', location: 'Chuo City' },
    { name: 'Meiji Shrine visit', description: 'Peaceful Shinto shrine in urban forest', location: 'Shibuya City' },
    { name: 'Harajuku fashion district', description: 'Youth culture and quirky fashion hub', location: 'Shibuya City' },
    { name: 'Imperial Palace gardens', description: "Serene gardens around the Emperor's residence", location: 'Chiyoda City' },
    { name: 'Ginza shopping', description: 'Upscale shopping and dining district', location: 'Chuo City' },
    { name: 'Shinjuku nightlife', description: 'Vibrant entertainment and dining district', location: 'Shinjuku district' },
    { name: 'Traditional ryokan dinner', description: 'Authentic Japanese dining experience', location: 'Various locations' }
  ]};
  if (city.includes('rome')) return { activities: [
    { name: 'Colosseum tour', description: 'Ancient amphitheater where gladiators once fought', location: 'Piazza del Colosseo' },
    { name: 'Vatican Museums', description: 'Sistine Chapel and world-class art collection', location: 'Vatican City' },
    { name: 'Trevi Fountain visit', description: 'Baroque fountain perfect for coin-throwing wishes', location: 'Piazza di Trevi' },
    { name: 'Roman Forum exploration', description: "Ancient ruins of Roman civilization's heart", location: 'Via della Salara Vecchia' },
    { name: 'Pantheon visit', description: 'Best-preserved Roman building with stunning dome', location: 'Piazza della Rotonda' },
    { name: 'Spanish Steps climb', description: 'Famous stairway at Piazza di Spagna', location: 'Piazza di Spagna' },
    { name: 'Trastevere dining', description: 'Charming neighborhood with authentic trattorias', location: 'Trastevere district' },
    { name: "Castel Sant'Angelo", description: 'Towering cylindrical building with papal history', location: 'Lungotevere Castello' },
    { name: 'Villa Borghese gardens', description: 'Beautiful park with museums and galleries', location: 'Villa Borghese' },
    { name: "Campo de' Fiori market", description: 'Vibrant morning market and evening nightlife', location: "Campo de' Fiori" }
  ]};
  return { activities: [
    { name: `${destination} city center tour`, description: 'Explore the heart of the city', location: 'City center' },
    { name: `${destination} main attraction`, description: 'Visit the most famous landmark', location: 'Tourist district' },
    { name: `${destination} cultural experience`, description: 'Immerse in local culture', location: 'Cultural quarter' },
    { name: `${destination} local market`, description: 'Experience local life and shopping', location: 'Market district' },
    { name: `${destination} scenic viewpoint`, description: 'Best views of the city', location: 'Observation area' },
    { name: `${destination} museum visit`, description: 'Learn about local history and art', location: 'Museum district' },
    { name: `${destination} dining experience`, description: 'Taste authentic local cuisine', location: 'Restaurant area' },
    { name: `${destination} evening entertainment`, description: 'Local nightlife and shows', location: 'Entertainment district' },
    { name: `${destination} park or garden`, description: 'Relax in natural surroundings', location: 'Green spaces' },
    { name: `${destination} shopping area`, description: 'Browse local shops and souvenirs', location: 'Shopping district' }
  ]};
};

export const generateTripSummary = (tripData) => {
  return `🌟 *AI Travel Plan for ${tripData.destination}* 🌟

📅 *Duration:* ${tripData.duration}
📆 *Dates:* ${tripData.dates}

✨ *Trip Overview:*
${tripData.overview}

🎯 *Highlights:*
${tripData.highlights?.map(h => `• ${h}`).join('\n') || 'Amazing experiences await!'}

💰 *Estimated Budget:* ${tripData.budgetEstimate?.total || 'Budget details in full plan'}

🎒 *Ready for an amazing adventure?*
Your personalized itinerary is ready!

Generated by AI Travel Planner ✈️

*Contact for full detailed itinerary and bookings*`;
};
