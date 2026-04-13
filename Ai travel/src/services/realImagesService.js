// Real Images Service - No API Keys Required
// Uses multiple free image sources for travel locations

export const fetchRealLocationImages = async (locationName, destination = '') => {
  try {
    // Clean location name for better search
    const cleanLocation = cleanLocationName(locationName);
    const cleanDestination = cleanLocationName(destination);
    
    // Generate multiple image sources
    const imageUrls = generateImageUrls(cleanLocation, cleanDestination);
    
    return {
      primary: imageUrls[0],
      thumbnail: imageUrls[1],
      fallback: imageUrls[2],
      title: `${cleanLocation} - ${cleanDestination}`,
      source: 'Travel Images'
    };
    
  } catch (error) {
    console.error('Error fetching location images:', error);
    return getDefaultImage(locationName, destination);
  }
};

// Generate multiple image URLs for better coverage
const generateImageUrls = (location, destination) => {
  const searchTerms = [
    `${location}+${destination}+landmark`,
    `${location}+tourist+attraction`,
    `${destination}+${location}+travel`,
    `${location}+famous+place`,
    `${destination}+sightseeing`
  ];
  
  const imageSources = [
    // Unsplash - High quality travel photos
    (term) => `https://source.unsplash.com/800x600/?${term}`,
    (term) => `https://source.unsplash.com/600x400/?${term}`,
    (term) => `https://source.unsplash.com/400x300/?${term}`,
    
    // Picsum - Reliable fallback
    () => `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
    () => `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`
  ];
  
  return searchTerms.map((term, index) => {
    const sourceIndex = index % imageSources.length;
    return imageSources[sourceIndex](term);
  });
};

// Clean location names for better image search
const cleanLocationName = (name) => {
  return name
    .toLowerCase()
    .replace(/visit|explore|tour|experience|at|in|the|a|an/gi, '')
    .replace(/\([^)]*\)/g, '') // Remove parentheses
    .replace(/\$\d+[-\d]*/, '') // Remove prices
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '+');
};

// Enhanced trip images with real locations
export const enhanceTripWithRealImages = async (tripData) => {
  try {
    console.log('🖼️ Adding real images to trip plan...');
    
    const enhancedData = { ...tripData };
    
    // Add hero image for destination
    const heroImage = await fetchRealLocationImages(`${tripData.destination} skyline`, tripData.destination);
    enhancedData.heroImage = heroImage;
    
    // Add images to highlights
    if (tripData.highlights) {
      enhancedData.highlightImages = {};
      for (let i = 0; i < tripData.highlights.length; i++) {
        const highlight = tripData.highlights[i];
        const locationName = extractMainLocation(highlight);
        const image = await fetchRealLocationImages(locationName, tripData.destination);
        enhancedData.highlightImages[i] = image;
      }
    }
    
    // Add images to daily activities
    if (tripData.dailyItinerary) {
      for (let dayIndex = 0; dayIndex < tripData.dailyItinerary.length; dayIndex++) {
        const day = tripData.dailyItinerary[dayIndex];
        if (day.activities) {
          for (let actIndex = 0; actIndex < day.activities.length; actIndex++) {
            const activity = day.activities[actIndex];
            const locationName = extractMainLocation(activity.activity);
            const image = await fetchRealLocationImages(locationName, tripData.destination);
            enhancedData.dailyItinerary[dayIndex].activities[actIndex].realImage = image;
          }
        }
      }
    }
    
    console.log('✅ Real images added successfully!');
    return enhancedData;
    
  } catch (error) {
    console.error('Error enhancing trip with images:', error);
    return tripData;
  }
};

// Extract main location from text
const extractMainLocation = (text) => {
  // Remove common words and extract key location terms
  const words = text
    .replace(/visit|explore|tour|experience|at|in|the|a|an/gi, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\$\d+[-\d]*/, '')
    .trim()
    .split(' ')
    .filter(word => word.length > 2)
    .slice(0, 3);
    
  return words.join(' ');
};

// Get destination-specific famous locations
export const getFamousLocations = (destination) => {
  const city = destination.toLowerCase();
  
  const locations = {
    'paris': [
      'Eiffel Tower', 'Louvre Museum', 'Notre Dame Cathedral', 
      'Arc de Triomphe', 'Champs Elysees', 'Montmartre', 
      'Seine River', 'Versailles Palace'
    ],
    'tokyo': [
      'Tokyo Tower', 'Shibuya Crossing', 'Senso-ji Temple',
      'Mount Fuji', 'Tokyo Skytree', 'Meiji Shrine',
      'Tsukiji Market', 'Imperial Palace'
    ],
    'rome': [
      'Colosseum', 'Vatican City', 'Trevi Fountain',
      'Roman Forum', 'Pantheon', 'Spanish Steps',
      'Castel Sant Angelo', 'Trastevere'
    ],
    'london': [
      'Big Ben', 'Tower Bridge', 'Buckingham Palace',
      'London Eye', 'Westminster Abbey', 'British Museum',
      'Tower of London', 'Hyde Park'
    ],
    'new york': [
      'Statue of Liberty', 'Times Square', 'Central Park',
      'Empire State Building', 'Brooklyn Bridge', 'One World Trade',
      'High Line', 'Wall Street'
    ],
    'dubai': [
      'Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall',
      'Burj Al Arab', 'Dubai Marina', 'Gold Souk',
      'Dubai Fountain', 'Desert Safari'
    ],
    'mumbai': [
      'Gateway of India', 'Marine Drive', 'Taj Hotel',
      'Chhatrapati Shivaji Terminus', 'Elephanta Caves',
      'Bollywood Studios', 'Juhu Beach', 'Crawford Market'
    ],
    'delhi': [
      'Red Fort', 'India Gate', 'Lotus Temple',
      'Qutub Minar', 'Raj Ghat', 'Humayuns Tomb',
      'Chandni Chowk', 'Akshardham Temple'
    ]
  };
  
  // Find matching city
  for (const [key, places] of Object.entries(locations)) {
    if (city.includes(key)) {
      return places;
    }
  }
  
  // Return generic locations if city not found
  return [
    `${destination} landmark`,
    `${destination} tourist attraction`,
    `${destination} famous place`,
    `${destination} city center`,
    `${destination} monument`
  ];
};

// Get default image if all else fails
const getDefaultImage = (location, destination) => {
  return {
    primary: `https://source.unsplash.com/800x600/?${destination},travel`,
    thumbnail: `https://source.unsplash.com/400x300/?${destination},travel`,
    fallback: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
    title: `${location} - ${destination}`,
    source: 'Travel Images'
  };
};

// Preload images for better performance
export const preloadTripImages = async (destination) => {
  try {
    const famousPlaces = getFamousLocations(destination);
    const imagePromises = famousPlaces.slice(0, 5).map(place => 
      fetchRealLocationImages(place, destination)
    );
    
    const images = await Promise.all(imagePromises);
    
    return {
      destination,
      preloadedImages: images.reduce((acc, img, index) => {
        acc[famousPlaces[index]] = img;
        return acc;
      }, {})
    };
    
  } catch (error) {
    console.error('Error preloading images:', error);
    return { destination, preloadedImages: {} };
  }
};