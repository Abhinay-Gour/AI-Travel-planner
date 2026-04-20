import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTripWithAI = async (tripParams) => {
  try {
    const { destination, startDate, endDate, duration, preferences, userPreferences } = tripParams;
    
    console.log('🤖 Generating trip with AI for:', destination);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Create a detailed travel plan for ${destination} from ${startDate} to ${endDate} (${duration} days).

User Preferences:
- Budget: ${userPreferences?.budget || 'mid-range'}
- Travel Style: ${userPreferences?.travelStyle || 'cultural'}
- Interests: ${userPreferences?.interests?.join(', ') || 'general sightseeing'}
- Additional Preferences: ${preferences || 'none'}

Please provide a comprehensive travel plan in the following JSON format:
{
  "destination": "${destination}",
  "country": "country name",
  "overview": "detailed trip overview (2-3 sentences)",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Specific location",
          "description": "Activity description",
          "duration": "2 hours",
          "cost": "$30-50",
          "category": "sightseeing",
          "coordinates": {"lat": 0.0, "lng": 0.0}
        }
      ]
    }
  ],
  "budgetEstimate": {
    "accommodation": "$200-400",
    "food": "$150-300",
    "transport": "$100-200",
    "activities": "$200-400",
    "shopping": "$100-200",
    "total": "$750-1500",
    "currency": "USD"
  },
  "travelTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "packingList": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "bestTimeToVisit": "season/months",
  "localCurrency": "currency name",
  "language": "local language",
  "timeZone": "timezone"
}

Make sure to:
1. Include real places and accurate information
2. Provide specific locations with approximate coordinates
3. Create a realistic daily schedule (8-10 hours per day)
4. Include variety in activities (sightseeing, food, culture, relaxation)
5. Adjust budget based on user preferences
6. Include practical travel tips
7. Consider local customs and culture
8. Provide realistic time estimates for activities

Return only valid JSON without any additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 AI Response received, parsing...');
    
    // Clean and parse JSON response
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    let tripData;
    try {
      tripData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.log('Raw response:', text);
      
      // Fallback: create basic trip data
      tripData = createFallbackTripData(destination, duration, startDate, endDate);
    }
    
    // Validate and enhance trip data
    tripData = validateAndEnhanceTripData(tripData, tripParams);
    
    console.log('✅ Trip data generated successfully');
    return tripData;
    
  } catch (error) {
    console.error('❌ AI trip generation error:', error);
    
    // Return fallback trip data
    return createFallbackTripData(tripParams.destination, tripParams.duration, tripParams.startDate, tripParams.endDate);
  }
};

const createFallbackTripData = (destination, duration, startDate, endDate) => {
  const start = new Date(startDate);
  const days = parseInt(duration) || 3;
  
  return {
    destination,
    country: destination.split(',').pop()?.trim() || 'Unknown',
    overview: `Exciting ${duration}-day adventure in ${destination} with carefully planned activities, authentic local experiences, and cultural immersion. This personalized itinerary includes must-see attractions, local dining, and memorable experiences.`,
    highlights: [
      `Explore the main attractions of ${destination}`,
      'Experience authentic local cuisine and culture',
      'Visit historical landmarks and museums',
      'Discover scenic viewpoints and photo opportunities'
    ],
    dailyItinerary: Array.from({ length: days }, (_, i) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      return {
        day: i + 1,
        date: currentDate.toISOString().split('T')[0],
        title: `${destination} Discovery Day ${i + 1}`,
        activities: [
          {
            time: '09:00 AM',
            activity: `${destination} city center tour`,
            location: 'City center',
            description: 'Explore the heart of the city',
            duration: '3 hours',
            cost: '$30-50',
            category: 'sightseeing',
            coordinates: { lat: 0, lng: 0 }
          },
          {
            time: '02:00 PM',
            activity: `${destination} main attraction`,
            location: 'Tourist district',
            description: 'Visit the most famous landmark',
            duration: '2 hours',
            cost: '$40-60',
            category: 'sightseeing',
            coordinates: { lat: 0, lng: 0 }
          },
          {
            time: '07:00 PM',
            activity: `${destination} cultural experience`,
            location: 'Cultural quarter',
            description: 'Immerse in local culture',
            duration: '2 hours',
            cost: '$35-55',
            category: 'entertainment',
            coordinates: { lat: 0, lng: 0 }
          }
        ]
      };
    }),
    budgetEstimate: {
      accommodation: '$200-400',
      food: '$150-300',
      transport: '$100-200',
      activities: '$200-400',
      shopping: '$100-200',
      total: '$750-1500',
      currency: 'USD'
    },
    travelTips: [
      `Book accommodations in ${destination} in advance for better rates`,
      'Try local transportation to experience the city like a local',
      'Learn basic local phrases to enhance your cultural experience',
      'Keep copies of important documents in separate locations',
      'Research local customs and etiquette before visiting'
    ],
    packingList: [
      'Comfortable walking shoes for sightseeing',
      'Weather-appropriate clothing layers',
      'Camera and portable chargers',
      'Travel documents and emergency contacts',
      'Basic first aid kit and personal medications',
      'Universal power adapter',
      'Guidebook or offline maps app'
    ],
    bestTimeToVisit: `Research ${destination} weather patterns and seasonal events for optimal timing`,
    localCurrency: 'Check local currency and exchange rates',
    language: 'Check local language and download translation apps',
    timeZone: 'Check local timezone for planning'
  };
};

const validateAndEnhanceTripData = (tripData, tripParams) => {
  // Ensure required fields exist
  if (!tripData.destination) tripData.destination = tripParams.destination;
  if (!tripData.overview) tripData.overview = `Amazing ${tripParams.duration}-day trip to ${tripParams.destination}`;
  if (!tripData.highlights || !Array.isArray(tripData.highlights)) {
    tripData.highlights = [`Explore ${tripParams.destination}`, 'Local cuisine experience', 'Cultural attractions', 'Scenic locations'];
  }
  
  // Validate daily itinerary
  if (!tripData.dailyItinerary || !Array.isArray(tripData.dailyItinerary)) {
    tripData.dailyItinerary = [];
  }
  
  // Ensure budget estimate exists
  if (!tripData.budgetEstimate) {
    tripData.budgetEstimate = {
      total: '$500-1000',
      currency: 'USD'
    };
  }
  
  // Ensure arrays exist
  if (!tripData.travelTips) tripData.travelTips = ['Plan ahead', 'Stay safe', 'Enjoy local culture'];
  if (!tripData.packingList) tripData.packingList = ['Comfortable shoes', 'Camera', 'Travel documents'];
  
  return tripData;
};

export const generateTripSummary = (tripData) => {
  try {
    return `🌟 ${tripData.destination} - ${tripData.duration}

${tripData.overview}

🎯 Highlights:
${tripData.highlights?.map(h => `• ${h}`).join('\n') || 'Amazing experiences planned!'}

💰 Budget: ${tripData.budgetEstimate?.total || 'Estimated based on preferences'}

📋 ${tripData.dailyItinerary?.length || 0} days of detailed itinerary included!

Generated by AI Travel Planner ✈️`;
  } catch (error) {
    console.error('Summary generation error:', error);
    return `Your ${tripData.duration} trip to ${tripData.destination} is ready! Check your email for full details.`;
  }
};