import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Cache to avoid repeated API calls
const placesCache = new Map();

export const fetchRealPlaces = async (destination, limit = 12) => {
  const cacheKey = destination.toLowerCase().trim();
  if (placesCache.has(cacheKey)) return placesCache.get(cacheKey);

  try {
    const { data } = await axios.get(`${API_URL}/locations/places`, {
      params: { destination, limit },
      timeout: 8000,
    });

    if (data.success && data.data.places.length > 0) {
      placesCache.set(cacheKey, data.data.places);
      return data.data.places;
    }
    return [];
  } catch {
    return [];
  }
};

// Inject real locations into AI prompt
export const buildLocationAwarePrompt = (destination, days, startDate, endDate, preferences, realPlaces) => {
  const placesText = realPlaces.length > 0
    ? `\nREAL VERIFIED LOCATIONS IN ${destination.toUpperCase()}:\n${realPlaces.map((p, i) =>
        `${i + 1}. ${p.name} — ${p.location} (Rating: ${p.rating?.toFixed(1) || 'N/A'}, Type: ${p.types?.[0] || 'attraction'})`
      ).join('\n')}\n\nIMPORTANT: Use ONLY these verified locations in the itinerary. Include exact address from above.`
    : '';

  return `Create a detailed ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}.
${placesText}

Rules:
- Use the REAL locations listed above with their EXACT addresses
- Each day should have 3 activities with specific timings
- Include local food recommendations at real restaurants
- Add practical travel tips

Format each day exactly like:
Day [N] ([date]) - [Theme]
- [TIME]: [Activity at REAL location name]
  Location: [Exact address from list above]
  Why Visit: [2 sentence description]
  Cost: ₹[amount]
- [TIME]: [Next activity]
  Location: [Exact address]
  Why Visit: [Description]
  Cost: ₹[amount]

Budget Estimate:
- Accommodation: ₹[range] per night
- Food: ₹[range] per day  
- Activities: ₹[range] total
- Transportation: ₹[range] total
- Total: ₹[range] for entire trip

Travel Tips:
- [Tip specific to ${destination}]
- [Tip about local transport]
- [Best time/season tip]

Additional preferences: ${preferences || 'Standard travel experience'}`;
};
