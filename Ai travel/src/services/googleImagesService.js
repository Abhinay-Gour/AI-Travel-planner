// Google Images API Service for Travel Locations
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

// Google Custom Search API endpoint
const GOOGLE_IMAGES_API = 'https://www.googleapis.com/customsearch/v1';

export const fetchLocationImages = async (locationName, destination = '') => {
  try {
    if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.warn('Google API credentials not found, using fallback images');
      return getFallbackImages(locationName, destination);
    }

    // Create search query for better results
    const searchQuery = `${locationName} ${destination} tourist attraction landmark`.trim();
    
    const response = await fetch(
      `${GOOGLE_IMAGES_API}?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=3&imgSize=large&imgType=photo&safe=active`
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        url: item.link,
        thumbnail: item.image?.thumbnailLink || item.link,
        title: item.title,
        source: item.displayLink,
        width: item.image?.width || 800,
        height: item.image?.height || 600
      }));
    }

    // Fallback if no results
    return getFallbackImages(locationName, destination);

  } catch (error) {
    console.error('Error fetching Google images:', error);
    return getFallbackImages(locationName, destination);
  }
};

// Fetch multiple location images for a trip
export const fetchTripLocationImages = async (tripData) => {
  try {
    console.log('🖼️ Fetching Google Images for trip locations...');
    
    const imagePromises = [];
    
    // Get destination hero image
    imagePromises.push(
      fetchLocationImages(`${tripData.destination} skyline landmark`, tripData.destination)
        .then(images => ({ type: 'hero', location: tripData.destination, images }))
    );

    // Get highlight images
    if (tripData.highlights) {
      tripData.highlights.forEach((highlight, index) => {
        const locationName = extractLocationName(highlight);
        imagePromises.push(
          fetchLocationImages(locationName, tripData.destination)
            .then(images => ({ type: 'highlight', index, location: locationName, images }))
        );
      });
    }

    // Get daily activity images
    if (tripData.dailyItinerary) {
      tripData.dailyItinerary.forEach((day, dayIndex) => {
        if (day.activities) {
          day.activities.forEach((activity, actIndex) => {
            const locationName = extractLocationName(activity.activity);
            imagePromises.push(
              fetchLocationImages(locationName, tripData.destination)
                .then(images => ({ 
                  type: 'activity', 
                  dayIndex, 
                  actIndex, 
                  location: locationName, 
                  images 
                }))
            );
          });
        }
      });
    }

    // Wait for all image requests
    const imageResults = await Promise.all(imagePromises);
    
    // Process and attach images to trip data
    const enhancedTripData = { ...tripData };
    
    imageResults.forEach(result => {
      if (result.images && result.images.length > 0) {
        const primaryImage = result.images[0];
        
        switch (result.type) {
          case 'hero':
            enhancedTripData.heroImage = primaryImage;
            break;
            
          case 'highlight':
            if (!enhancedTripData.highlightImages) {
              enhancedTripData.highlightImages = {};
            }
            enhancedTripData.highlightImages[result.index] = primaryImage;
            break;
            
          case 'activity':
            if (!enhancedTripData.dailyItinerary[result.dayIndex].activities[result.actIndex].googleImage) {
              enhancedTripData.dailyItinerary[result.dayIndex].activities[result.actIndex].googleImage = primaryImage;
            }
            break;
        }
      }
    });

    console.log('✅ Google Images fetched successfully!');
    return enhancedTripData;

  } catch (error) {
    console.error('Error fetching trip location images:', error);
    return tripData; // Return original data if image fetching fails
  }
};

// Extract location name from activity or highlight text
const extractLocationName = (text) => {
  // Remove common words and extract main location/attraction name
  const cleanText = text
    .replace(/visit|explore|tour|experience|at|in|the|a|an/gi, '')
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/\$\d+[-\d]*/, '') // Remove price info
    .trim();
  
  // Take first few meaningful words
  const words = cleanText.split(' ').filter(word => word.length > 2);
  return words.slice(0, 3).join(' ');
};

// Fallback images using Unsplash (existing system)
const getFallbackImages = (locationName, destination) => {
  const searchTerm = `${locationName} ${destination}`.replace(/\s+/g, '+');
  
  return [
    {
      url: `https://source.unsplash.com/800x600/?${searchTerm},travel,landmark`,
      thumbnail: `https://source.unsplash.com/400x300/?${searchTerm},travel,landmark`,
      title: `${locationName} - Travel Photo`,
      source: 'Unsplash',
      width: 800,
      height: 600
    }
  ];
};

// Get destination-specific search terms for better image results
export const getDestinationSearchTerms = (destination) => {
  const city = destination.toLowerCase();
  
  const searchTerms = {
    'paris': ['eiffel tower', 'louvre museum', 'notre dame', 'arc de triomphe', 'champs elysees'],
    'tokyo': ['tokyo tower', 'shibuya crossing', 'senso-ji temple', 'mount fuji', 'tokyo skytree'],
    'rome': ['colosseum', 'vatican', 'trevi fountain', 'roman forum', 'pantheon'],
    'london': ['big ben', 'tower bridge', 'buckingham palace', 'london eye', 'westminster'],
    'new york': ['statue of liberty', 'times square', 'central park', 'empire state building', 'brooklyn bridge'],
    'dubai': ['burj khalifa', 'palm jumeirah', 'dubai mall', 'burj al arab', 'dubai marina'],
    'mumbai': ['gateway of india', 'marine drive', 'taj hotel', 'chhatrapati shivaji', 'bollywood'],
    'delhi': ['red fort', 'india gate', 'lotus temple', 'qutub minar', 'raj ghat']
  };

  // Find matching city or return generic terms
  for (const [key, terms] of Object.entries(searchTerms)) {
    if (city.includes(key)) {
      return terms;
    }
  }

  return [`${destination} landmark`, `${destination} tourist attraction`, `${destination} famous places`];
};

// Batch fetch images for popular destinations
export const preloadDestinationImages = async (destination) => {
  try {
    const searchTerms = getDestinationSearchTerms(destination);
    const imagePromises = searchTerms.map(term => 
      fetchLocationImages(term, destination)
    );
    
    const results = await Promise.all(imagePromises);
    
    return {
      destination,
      preloadedImages: results.reduce((acc, images, index) => {
        acc[searchTerms[index]] = images;
        return acc;
      }, {})
    };
    
  } catch (error) {
    console.error('Error preloading destination images:', error);
    return { destination, preloadedImages: {} };
  }
};