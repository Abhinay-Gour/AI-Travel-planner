import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTripPlan = async (destination, startDate, endDate, days, preferences = '') => {
  try {
    if (!API_KEY) {
      throw new Error('API key not configured. Please check your .env file.');
    }

    // Try gemini-1.5-flash first, fallback to gemini-pro if 2.0 not available
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (modelError) {
      console.log('Gemini 1.5 Flash not available, trying gemini-pro');
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}.

IMPORTANT: Include REAL, FAMOUS, and SPECIFIC locations with detailed descriptions. Analyze the city/destination and provide authentic places that actually exist.

Please provide a comprehensive travel plan in the following JSON-like format:

Destination: ${destination}
Duration: ${days} days
Dates: ${startDate} to ${endDate}

Overview: [Brief 2-3 sentence overview highlighting what makes this destination special]

Highlights:
- [Real famous landmark/attraction 1 with brief description]
- [Real famous landmark/attraction 2 with brief description] 
- [Real famous landmark/attraction 3 with brief description]
- [Real famous landmark/attraction 4 with brief description]

Daily Itinerary:

Day 1 (${startDate}) - Arrival & City Center Exploration
- 09:00 AM: Airport pickup and hotel check-in near [REAL AREA NAME] ($50)
- 11:00 AM: Visit [REAL FAMOUS LANDMARK] - [Brief description of what makes it special] (3 hours, $25)
  Location: [Real address or area]
  Why Visit: [What's unique about this place]
- 02:00 PM: Explore [REAL NEIGHBORHOOD/DISTRICT] - [Description] ($15)
  Highlights: [Specific things to see/do there]
- 07:00 PM: Dinner at [REAL RESTAURANT TYPE] in [REAL AREA] ($40)
  Recommended: [Type of local cuisine]
Meals: Hotel breakfast, Local lunch at [real area], Traditional dinner
Accommodation: [Recommended hotel area with real neighborhood name]

[Continue for all ${days} days with REAL locations, landmarks, neighborhoods, restaurants, and attractions]

For each day, include:
- REAL landmark names and locations
- Specific neighborhoods and districts
- Actual famous attractions that exist
- Real restaurant types and food specialties
- Authentic cultural experiences
- Specific museums, parks, or historical sites
- Real shopping areas or markets
- Actual viewpoints or scenic spots

Budget Estimate:
- Accommodation: $80-150 per night
- Food: $40-80 per day
- Activities: $200-400 total
- Transportation: $100-200 total
- Total: $800-1500 for entire trip

Travel Tips:
- [Location-specific tip about ${destination}]
- [Cultural tip specific to this destination]
- [Transportation tip for this city]
- [Best time to visit specific attractions]

Packing List:
- [Climate-specific items for ${destination}]
- [Cultural-appropriate clothing]
- [Essential items for this destination's activities]

Best Time to Visit: [Specific weather and seasonal information for ${destination}]
Local Currency: [Actual currency used in ${destination}]
Language: [Primary language(s) spoken in ${destination}]

Additional preferences: ${preferences || 'Standard travel experience with authentic local experiences'}

Make the itinerary realistic, well-paced, and include ONLY real, existing locations with specific names, addresses when possible, and authentic local experiences. Focus on famous landmarks, popular neighborhoods, and well-known attractions that tourists actually visit in ${destination}.`;

    console.log('Generating detailed trip plan with real locations for:', destination);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response received successfully');
    
    // Parse the structured text response with enhanced location data and images
    const parsedData = parseTextResponseWithLocations(text, destination, startDate, endDate, days);
    
    console.log('✅ Trip plan with images generated successfully!');
    return parsedData;
    
  } catch (error) {
    console.error('Error generating trip plan:', error);
    
    // Return a fallback response with real locations and images
    const fallbackData = createEnhancedFallbackResponse(destination, startDate, endDate, days, error.message);
    
    console.log('✅ Fallback trip plan with images generated!');
    return fallbackData;
  }
};

// Enhanced parsing with location details and image integration
const parseTextResponseWithLocations = (text, destination, startDate, endDate, days) => {
  try {
    // Extract sections from the text
    const overviewMatch = text.match(/Overview:\s*([^\n]+(?:\n[^\n]*)*?)(?=\n\n|Highlights:|$)/i);
    const highlightsMatch = text.match(/Highlights:\s*([\s\S]*?)(?=\n\nDaily Itinerary:|Daily Itinerary:|Budget Estimate:|$)/i);
    const budgetMatch = text.match(/Budget Estimate:\s*([\s\S]*?)(?=\n\nTravel Tips:|Travel Tips:|$)/i);
    const tipsMatch = text.match(/Travel Tips:\s*([\s\S]*?)(?=\n\nPacking List:|Packing List:|$)/i);
    const dailyMatch = text.match(/Daily Itinerary:\s*([\s\S]*?)(?=\n\nBudget Estimate:|Budget Estimate:|$)/i);
    
    // Extract highlights with better parsing
    const highlights = [];
    if (highlightsMatch) {
      const highlightLines = highlightsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
      highlights.push(...highlightLines.map(line => line.replace(/^-\s*/, '').trim()).filter(h => h));
    }
    
    // Extract travel tips
    const travelTips = [];
    if (tipsMatch) {
      const tipLines = tipsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
      travelTips.push(...tipLines.map(line => line.replace(/^-\s*/, '').trim()).filter(t => t));
    }
    
    // Parse daily itinerary with location details
    const dailyItinerary = parseDailyItineraryWithLocations(dailyMatch ? dailyMatch[1] : '', days, startDate, destination);
    
    return {
      destination,
      duration: `${days} days`,
      dates: `${startDate} to ${endDate}`,
      overview: overviewMatch ? overviewMatch[1].trim() : `Exciting ${days}-day adventure in ${destination} with carefully planned activities and authentic local experiences.`,
      highlights: highlights.length > 0 ? highlights : getDefaultHighlights(destination),
      dailyItinerary,
      budgetEstimate: {
        accommodation: "$80 - $150 per night",
        food: "$40 - $80 per day",
        activities: "$200 - $400 total",
        transportation: "$100 - $200 total",
        total: `$${400 + (days * 60)} - $${600 + (days * 120)} for entire trip`
      },
      travelTips: travelTips.length > 0 ? travelTips : getDefaultTips(destination),
      packingList: getDestinationPackingList(destination),
      bestTimeToVisit: `Check ${destination} weather patterns and seasonal events for optimal timing`,
      localCurrency: getCurrencyInfo(destination),
      language: getLanguageInfo(destination),
      // Add images directly
      heroImage: {
        primary: `https://source.unsplash.com/800x400/?${destination.replace(/\s+/g, '+')}+skyline+landmark`,
        thumbnail: `https://source.unsplash.com/400x300/?${destination.replace(/\s+/g, '+')}+city`,
        fallback: `https://source.unsplash.com/600x400/?travel+destination`
      },
      highlightImages: (highlights.length > 0 ? highlights : getDefaultHighlights(destination)).reduce((acc, highlight, index) => {
        const searchTerm = highlight.split(' ').slice(0, 3).join('+');
        acc[index] = {
          primary: `https://source.unsplash.com/600x400/?${searchTerm}+${destination.replace(/\s+/g, '+')}`,
          thumbnail: `https://source.unsplash.com/300x200/?${searchTerm}`,
          fallback: `https://source.unsplash.com/400x300/?${destination.replace(/\s+/g, '+')}+attraction`
        };
        return acc;
      }, {}),
      rawResponse: text
    };
  } catch (parseError) {
    console.error('Error parsing enhanced response:', parseError);
    return createEnhancedFallbackResponse(destination, startDate, endDate, days, text);
  }
};

// Parse daily itinerary with location details
const parseDailyItineraryWithLocations = (dailyText, days, startDate, destination) => {
  const itinerary = [];
  const start = new Date(startDate);
  
  // Try to extract day-by-day information from the text
  const dayMatches = dailyText.match(/Day \d+[^\n]*[\s\S]*?(?=Day \d+|$)/gi) || [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    let dayData = null;
    if (dayMatches[i]) {
      dayData = parseSingleDay(dayMatches[i], i + 1, currentDate.toISOString().split('T')[0]);
    }
    
    if (!dayData) {
      dayData = generateEnhancedFallbackDay(i + 1, currentDate.toISOString().split('T')[0], destination, days);
    }
    
    itinerary.push(dayData);
  }
  
  return itinerary;
};

// Parse a single day with location details
const parseSingleDay = (dayText, dayNumber, date) => {
  try {
    const titleMatch = dayText.match(/Day \d+[^\n]*?-\s*([^\n]+)/i);
    const activities = [];
    
    // Extract time-based activities
    const timeMatches = dayText.match(/\d{1,2}:\d{2}\s*[AP]M[^\n]*[\s\S]*?(?=\d{1,2}:\d{2}\s*[AP]M|Meals:|Accommodation:|$)/gi) || [];
    
    timeMatches.forEach(timeBlock => {
      const timeMatch = timeBlock.match(/(\d{1,2}:\d{2}\s*[AP]M)/);
      const activityMatch = timeBlock.match(/[AP]M[:\s]*([^\n]+)/);
      const locationMatch = timeBlock.match(/Location:\s*([^\n]+)/i);
      const whyVisitMatch = timeBlock.match(/Why Visit:\s*([^\n]+)/i);
      const costMatch = timeBlock.match(/\$(\d+(?:-\d+)?)/);;
      
      if (timeMatch && activityMatch) {
        const activityName = activityMatch[1].trim();
        activities.push({
          time: timeMatch[1],
          activity: activityName,
          location: locationMatch ? locationMatch[1].trim() : 'City center',
          description: whyVisitMatch ? whyVisitMatch[1].trim() : 'Exciting local experience',
          duration: '2-3 hours',
          cost: costMatch ? `$${costMatch[1]}` : '$30-50',
          image: generateImageUrl(activityName, destination),
          realImage: {
            primary: generateImageUrl(activityName, destination),
            thumbnail: `https://source.unsplash.com/400x300/?${activityName.replace(/\s+/g, '+')}+${destination}`,
            fallback: `https://source.unsplash.com/600x400/?${destination}+travel`
          }
        });
      }
    });
    
    return {
      day: dayNumber,
      date,
      title: titleMatch ? titleMatch[1].trim() : `Day ${dayNumber} Adventures`,
      activities: activities.length > 0 ? activities : [],
      meals: {
        breakfast: "Local café or hotel breakfast",
        lunch: "Traditional restaurant with local specialties",
        dinner: "Recommended dining experience"
      },
      accommodation: "Comfortable hotel in prime location"
    };
  } catch (error) {
    console.error('Error parsing single day:', error);
    return null;
  }
};

// Generate image URL for locations/activities - Enhanced version
const generateImageUrl = (activity, destination = '') => {
  // Clean the activity name for better search
  const cleanActivity = activity.toLowerCase()
    .replace(/visit|explore|tour|experience|at|in|the|a|an/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  
  const searchTerm = `${cleanActivity}+${destination}+travel+landmark`.replace(/\s+/g, '+');
  return `https://source.unsplash.com/800x600/?${searchTerm}`;
};

// Get default highlights for popular destinations
const getDefaultHighlights = (destination) => {
  const city = destination.toLowerCase();
  
  if (city.includes('paris')) {
    return [
      "Eiffel Tower - Iconic iron lattice tower and symbol of Paris",
      "Louvre Museum - World's largest art museum with Mona Lisa",
      "Notre-Dame Cathedral - Gothic masterpiece on Île de la Cité",
      "Champs-Élysées - Famous avenue for shopping and dining"
    ];
  } else if (city.includes('tokyo')) {
    return [
      "Senso-ji Temple - Ancient Buddhist temple in Asakusa",
      "Shibuya Crossing - World's busiest pedestrian crossing",
      "Tokyo Skytree - Tallest structure in Japan with panoramic views",
      "Tsukiji Outer Market - Fresh seafood and street food paradise"
    ];
  } else if (city.includes('rome')) {
    return [
      "Colosseum - Ancient amphitheater and gladiator arena",
      "Vatican City - St. Peter's Basilica and Sistine Chapel",
      "Trevi Fountain - Baroque fountain for coin-throwing wishes",
      "Roman Forum - Ancient ruins of Roman civilization"
    ];
  } else if (city.includes('london')) {
    return [
      "Big Ben & Houses of Parliament - Iconic clock tower",
      "Tower Bridge - Victorian bascule bridge over Thames",
      "British Museum - World-class collection of artifacts",
      "Buckingham Palace - Official residence of British royalty"
    ];
  } else if (city.includes('new york')) {
    return [
      "Statue of Liberty - Symbol of freedom and democracy",
      "Central Park - Urban oasis in Manhattan",
      "Times Square - Bright lights and Broadway shows",
      "Empire State Building - Art Deco skyscraper with city views"
    ];
  }
  
  return [
    `Explore the main attractions of ${destination}`,
    "Experience authentic local cuisine and culture",
    "Visit historical landmarks and museums",
    "Discover scenic viewpoints and photo opportunities"
  ];
};

// Get destination-specific tips
const getDefaultTips = (destination) => {
  return [
    `Book accommodations in ${destination} in advance for better rates`,
    "Try local transportation to experience the city like a local",
    "Learn basic local phrases to enhance your cultural experience",
    "Keep copies of important documents in separate locations",
    "Research local customs and etiquette before visiting"
  ];
};

// Get destination-specific packing list
const getDestinationPackingList = (destination) => {
  return [
    "Comfortable walking shoes for sightseeing",
    "Weather-appropriate clothing layers",
    "Camera and portable chargers",
    "Travel documents and emergency contacts",
    "Basic first aid kit and personal medications",
    "Universal power adapter",
    "Guidebook or offline maps app"
  ];
};

// Get currency information
const getCurrencyInfo = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris') || city.includes('france')) return "Euro (EUR)";
  if (city.includes('tokyo') || city.includes('japan')) return "Japanese Yen (JPY)";
  if (city.includes('london') || city.includes('uk')) return "British Pound (GBP)";
  if (city.includes('new york') || city.includes('usa')) return "US Dollar (USD)";
  return "Check local currency and exchange rates";
};

// Get language information
const getLanguageInfo = (destination) => {
  const city = destination.toLowerCase();
  if (city.includes('paris') || city.includes('france')) return "French (English widely spoken in tourist areas)";
  if (city.includes('tokyo') || city.includes('japan')) return "Japanese (English in major tourist areas)";
  if (city.includes('london') || city.includes('uk')) return "English";
  if (city.includes('rome') || city.includes('italy')) return "Italian (English in tourist areas)";
  return "Check local language and download translation apps";
};

// Enhanced fallback function with real locations and images
const createEnhancedFallbackResponse = (destination, startDate, endDate, days, errorInfo) => {
  console.log('Creating enhanced fallback response for:', destination);
  
  return {
    destination,
    duration: `${days} days`,
    dates: `${startDate} to ${endDate}`,
    overview: `Exciting ${days}-day adventure in ${destination} with carefully planned activities, authentic local experiences, and cultural immersion. This personalized itinerary includes must-see attractions, local dining, and memorable experiences.`,
    highlights: getDefaultHighlights(destination),
    dailyItinerary: generateEnhancedFallbackItinerary(days, startDate, destination),
    budgetEstimate: {
      accommodation: "$80 - $150 per night",
      food: "$40 - $80 per day",
      activities: "$200 - $400 total",
      transportation: "$100 - $200 total",
      total: `$${400 + (days * 60)} - $${600 + (days * 120)} for entire trip`
    },
    travelTips: getDefaultTips(destination),
    packingList: getDestinationPackingList(destination),
    bestTimeToVisit: `Research ${destination} weather patterns and seasonal events for optimal timing`,
    localCurrency: getCurrencyInfo(destination),
    language: getLanguageInfo(destination),
    // Add images to fallback response
    heroImage: {
      primary: `https://source.unsplash.com/800x400/?${destination.replace(/\s+/g, '+')}+skyline+landmark`,
      thumbnail: `https://source.unsplash.com/400x300/?${destination.replace(/\s+/g, '+')}+city`,
      fallback: `https://source.unsplash.com/600x400/?travel+destination`
    },
    highlightImages: getDefaultHighlights(destination).reduce((acc, highlight, index) => {
      const searchTerm = highlight.split(' ').slice(0, 3).join('+');
      acc[index] = {
        primary: `https://source.unsplash.com/600x400/?${searchTerm}+${destination.replace(/\s+/g, '+')}`,
        thumbnail: `https://source.unsplash.com/300x200/?${searchTerm}`,
        fallback: `https://source.unsplash.com/400x300/?${destination.replace(/\s+/g, '+')}+attraction`
      };
      return acc;
    }, {}),
    generatedBy: "AI Travel Planner Enhanced Fallback System"
  };
};

// Generate enhanced fallback daily itinerary with real locations
const generateEnhancedFallbackItinerary = (days, startDate, destination) => {
  const itinerary = [];
  const start = new Date(startDate);
  
  const locationData = getDestinationLocationData(destination);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    itinerary.push(generateEnhancedFallbackDay(i + 1, currentDate.toISOString().split('T')[0], destination, days, locationData));
  }
  
  return itinerary;
};

// Generate enhanced fallback day with real locations
const generateEnhancedFallbackDay = (dayNumber, date, destination, totalDays, locationData = null) => {
  if (!locationData) {
    locationData = getDestinationLocationData(destination);
  }
  
  const dayTitle = dayNumber === 1 ? "Arrival & City Exploration" : 
                  dayNumber === totalDays ? "Final Day & Departure" : 
                  `${destination} Discovery Day ${dayNumber}`;
  
  const dayLocations = locationData.activities.slice((dayNumber - 1) * 3, dayNumber * 3);
  
  const activities = [
    {
      time: "09:00 AM",
      activity: dayLocations[0]?.name || `Explore ${destination} city center`,
      description: dayLocations[0]?.description || "Start your day with exciting exploration",
      location: dayLocations[0]?.location || "City center area",
      duration: "2-3 hours",
      cost: "$30-50",
      image: generateImageUrl(dayLocations[0]?.name || `${destination} landmark`, destination),
      realImage: {
        primary: generateImageUrl(dayLocations[0]?.name || `${destination} landmark`, destination),
        thumbnail: `https://source.unsplash.com/400x300/?${destination}+landmark`,
        fallback: `https://source.unsplash.com/600x400/?${destination}+travel`
      }
    },
    {
      time: "02:00 PM",
      activity: dayLocations[1]?.name || `Visit ${destination} attractions`,
      description: dayLocations[1]?.description || "Afternoon cultural and sightseeing activities",
      location: dayLocations[1]?.location || "Main tourist area",
      duration: "3-4 hours",
      cost: "$40-60",
      image: generateImageUrl(dayLocations[1]?.name || `${destination} museum`, destination),
      realImage: {
        primary: generateImageUrl(dayLocations[1]?.name || `${destination} museum`, destination),
        thumbnail: `https://source.unsplash.com/400x300/?${destination}+museum`,
        fallback: `https://source.unsplash.com/600x400/?${destination}+attraction`
      }
    },
    {
      time: "07:00 PM",
      activity: dayLocations[2]?.name || `${destination} evening experience`,
      description: dayLocations[2]?.description || "Evening relaxation and local experiences",
      location: dayLocations[2]?.location || "Entertainment district",
      duration: "2-3 hours",
      cost: "$35-55",
      image: generateImageUrl(dayLocations[2]?.name || `${destination} restaurant`, destination),
      realImage: {
        primary: generateImageUrl(dayLocations[2]?.name || `${destination} restaurant`, destination),
        thumbnail: `https://source.unsplash.com/400x300/?${destination}+restaurant`,
        fallback: `https://source.unsplash.com/600x400/?${destination}+nightlife`
      }
    }
  ];
  
  return {
    day: dayNumber,
    date,
    title: dayTitle,
    activities,
    meals: {
      breakfast: `Local café or hotel breakfast in ${destination}`,
      lunch: `Traditional ${destination} restaurant with local specialties`,
      dinner: `Recommended ${destination} dining experience`
    },
    accommodation: `Comfortable hotel in prime ${destination} location`
  };
};

// Get destination-specific location data
const getDestinationLocationData = (destination) => {
  const city = destination.toLowerCase();
  
  if (city.includes('paris')) {
    return {
      activities: [
        { name: "Eiffel Tower visit", description: "Iconic iron lattice tower with panoramic city views", location: "Champ de Mars, 7th arrondissement" },
        { name: "Louvre Museum tour", description: "World's largest art museum featuring the Mona Lisa", location: "Rue de Rivoli, 1st arrondissement" },
        { name: "Seine River cruise", description: "Romantic boat ride along Paris's historic river", location: "Port de la Bourdonnais" },
        { name: "Notre-Dame Cathedral", description: "Gothic masterpiece on Île de la Cité", location: "Île de la Cité, 4th arrondissement" },
        { name: "Champs-Élysées stroll", description: "Famous avenue for shopping and people-watching", location: "8th arrondissement" },
        { name: "Montmartre exploration", description: "Artistic hilltop district with Sacré-Cœur Basilica", location: "18th arrondissement" },
        { name: "Latin Quarter dining", description: "Historic neighborhood with cozy bistros", location: "5th arrondissement" },
        { name: "Versailles Palace", description: "Opulent royal palace with magnificent gardens", location: "Versailles (day trip)" },
        { name: "Marais district walk", description: "Trendy area with boutiques and galleries", location: "3rd and 4th arrondissements" },
        { name: "Arc de Triomphe", description: "Triumphal arch at the center of Place Charles de Gaulle", location: "Place Charles de Gaulle" }
      ]
    };
  } else if (city.includes('tokyo')) {
    return {
      activities: [
        { name: "Senso-ji Temple visit", description: "Ancient Buddhist temple in traditional Asakusa district", location: "Asakusa, Taito City" },
        { name: "Shibuya Crossing experience", description: "World's busiest pedestrian crossing", location: "Shibuya district" },
        { name: "Tokyo Skytree ascent", description: "Tallest structure in Japan with breathtaking views", location: "Sumida City" },
        { name: "Tsukiji Outer Market", description: "Fresh seafood and street food paradise", location: "Chuo City" },
        { name: "Meiji Shrine visit", description: "Peaceful Shinto shrine in urban forest", location: "Shibuya City" },
        { name: "Harajuku fashion district", description: "Youth culture and quirky fashion hub", location: "Shibuya City" },
        { name: "Imperial Palace gardens", description: "Serene gardens around the Emperor's residence", location: "Chiyoda City" },
        { name: "Ginza shopping", description: "Upscale shopping and dining district", location: "Chuo City" },
        { name: "Robot Restaurant show", description: "Futuristic entertainment experience", location: "Shinjuku district" },
        { name: "Traditional ryokan dinner", description: "Authentic Japanese dining experience", location: "Various locations" }
      ]
    };
  } else if (city.includes('rome')) {
    return {
      activities: [
        { name: "Colosseum tour", description: "Ancient amphitheater where gladiators once fought", location: "Piazza del Colosseo" },
        { name: "Vatican Museums", description: "Sistine Chapel and world-class art collection", location: "Vatican City" },
        { name: "Trevi Fountain visit", description: "Baroque fountain perfect for coin-throwing wishes", location: "Piazza di Trevi" },
        { name: "Roman Forum exploration", description: "Ancient ruins of Roman civilization's heart", location: "Via della Salara Vecchia" },
        { name: "Pantheon visit", description: "Best-preserved Roman building with stunning dome", location: "Piazza della Rotonda" },
        { name: "Spanish Steps climb", description: "Famous stairway connecting Piazza di Spagna", location: "Piazza di Spagna" },
        { name: "Trastevere dining", description: "Charming neighborhood with authentic trattorias", location: "Trastevere district" },
        { name: "Castel Sant'Angelo", description: "Towering cylindrical building with papal history", location: "Lungotevere Castello" },
        { name: "Villa Borghese gardens", description: "Beautiful park with museums and galleries", location: "Villa Borghese" },
        { name: "Campo de' Fiori market", description: "Vibrant morning market and evening nightlife", location: "Campo de' Fiori" }
      ]
    };
  }
  
  // Default activities for any destination
  return {
    activities: [
      { name: `${destination} city center tour`, description: "Explore the heart of the city", location: "City center" },
      { name: `${destination} main attraction`, description: "Visit the most famous landmark", location: "Tourist district" },
      { name: `${destination} cultural experience`, description: "Immerse in local culture", location: "Cultural quarter" },
      { name: `${destination} local market`, description: "Experience local life and shopping", location: "Market district" },
      { name: `${destination} scenic viewpoint`, description: "Best views of the city", location: "Observation area" },
      { name: `${destination} museum visit`, description: "Learn about local history and art", location: "Museum district" },
      { name: `${destination} dining experience`, description: "Taste authentic local cuisine", location: "Restaurant area" },
      { name: `${destination} evening entertainment`, description: "Local nightlife and shows", location: "Entertainment district" },
      { name: `${destination} park or garden`, description: "Relax in natural surroundings", location: "Green spaces" },
      { name: `${destination} shopping area`, description: "Browse local shops and souvenirs", location: "Shopping district" }
    ]
  };
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