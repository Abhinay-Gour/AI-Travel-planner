// Test the image system
import { enhanceTripWithRealImages } from './realImagesService.js';

// Test data
const testTripData = {
  destination: 'Paris, France',
  duration: '5 days',
  dates: '2024-01-15 to 2024-01-20',
  highlights: [
    'Eiffel Tower - Iconic iron lattice tower',
    'Louvre Museum - World famous art museum',
    'Notre Dame Cathedral - Gothic masterpiece'
  ],
  dailyItinerary: [
    {
      day: 1,
      activities: [
        {
          time: '09:00 AM',
          activity: 'Visit Eiffel Tower',
          location: 'Champ de Mars',
          description: 'Iconic landmark with city views'
        },
        {
          time: '02:00 PM', 
          activity: 'Louvre Museum tour',
          location: 'Rue de Rivoli',
          description: 'See the Mona Lisa and world art'
        }
      ]
    }
  ]
};

// Test the image enhancement
console.log('🧪 Testing image system...');
enhanceTripWithRealImages(testTripData).then(result => {
  console.log('✅ Images added:', result);
}).catch(error => {
  console.error('❌ Image test failed:', error);
});