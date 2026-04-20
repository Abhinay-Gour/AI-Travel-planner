// Simple test to verify images are working
console.log('🧪 Testing image URLs...');

// Test different destinations
const destinations = ['Paris', 'Tokyo', 'Rome', 'Mumbai', 'London'];

destinations.forEach(dest => {
  const heroImage = `https://source.unsplash.com/800x400/?${dest.replace(/\s+/g, '+')}+skyline+landmark`;
  const attractionImage = `https://source.unsplash.com/600x400/?${dest}+tourist+attraction`;
  
  console.log(`📍 ${dest}:`);
  console.log(`  Hero: ${heroImage}`);
  console.log(`  Attraction: ${attractionImage}`);
  
  // Test if images load
  const img = new Image();
  img.onload = () => console.log(`✅ ${dest} hero image loaded successfully`);
  img.onerror = () => console.log(`❌ ${dest} hero image failed to load`);
  img.src = heroImage;
});

console.log('🔗 Test these URLs in browser to verify images work:');
console.log('https://source.unsplash.com/800x400/?paris+skyline+landmark');
console.log('https://source.unsplash.com/600x400/?tokyo+temple+attraction');
console.log('https://source.unsplash.com/400x300/?rome+colosseum');