import express from 'express';
import axios from 'axios';

const router = express.Router();

const OTM_KEY = process.env.OPENTRIPMAP_KEY;
const GMAPS_KEY = process.env.GOOGLE_MAPS_KEY;

// Fetch real places for a destination using OpenTripMap (free) or Google Places
router.get('/places', async (req, res) => {
  const { destination, limit = 15 } = req.query;
  if (!destination) return res.status(400).json({ success: false, message: 'Destination required' });

  try {
    let places = [];

    // Try Google Places API first (if key available)
    if (GMAPS_KEY) {
      places = await fetchGooglePlaces(destination, parseInt(limit));
    }

    // Fallback to OpenTripMap (completely free, no key needed for basic)
    if (places.length === 0) {
      places = await fetchOpenTripMap(destination, parseInt(limit));
    }

    // Final fallback to curated data
    if (places.length === 0) {
      places = getCuratedPlaces(destination);
    }

    res.json({ success: true, data: { places, destination } });
  } catch (error) {
    const fallback = getCuratedPlaces(destination);
    res.json({ success: true, data: { places: fallback, destination, fallback: true } });
  }
});

// Google Places API
const fetchGooglePlaces = async (destination, limit) => {
  try {
    const searchRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodeURIComponent(destination)}&key=${GMAPS_KEY}&language=en`
    );

    if (!searchRes.data.results?.length) return [];

    return searchRes.data.results.slice(0, limit).map(place => ({
      name: place.name,
      location: place.formatted_address || destination,
      rating: place.rating || 4.0,
      types: place.types?.slice(0, 2).map(t => t.replace(/_/g, ' ')) || ['attraction'],
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GMAPS_KEY}`
        : null,
      placeId: place.place_id,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      source: 'google',
    }));
  } catch {
    return [];
  }
};

// OpenTripMap API (Free — no key needed for basic usage)
const fetchOpenTripMap = async (destination, limit) => {
  try {
    // Get coordinates first
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'AI-Travel-Planner/1.0' } }
    );

    if (!geoRes.data?.[0]) return [];
    const { lat, lon } = geoRes.data[0];

    // Fetch places around coordinates
    const placesRes = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${lon}&lat=${lat}&kinds=interesting_places,cultural,natural,architecture,religion,museums,sport&limit=${limit}&rate=3&format=json${OTM_KEY ? `&apikey=${OTM_KEY}` : ''}`,
      { headers: { 'User-Agent': 'AI-Travel-Planner/1.0' } }
    );

    if (!placesRes.data?.features?.length) return [];

    return placesRes.data.features
      .filter(f => f.properties.name)
      .map(f => ({
        name: f.properties.name,
        location: `${destination}`,
        rating: (f.properties.rate || 3) * 0.8,
        types: [f.properties.kinds?.split(',')[0]?.replace(/_/g, ' ') || 'attraction'],
        photo: null,
        mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(f.properties.name + ' ' + destination)}`,
        source: 'opentripmap',
        lat: f.geometry?.coordinates?.[1],
        lon: f.geometry?.coordinates?.[0],
      }));
  } catch {
    return [];
  }
};

// Curated fallback data for popular destinations
const getCuratedPlaces = (destination) => {
  const d = destination.toLowerCase();
  const CURATED = {
    goa: [
      { name: 'Baga Beach', location: 'Baga, North Goa', rating: 4.5, types: ['beach'], mapsUrl: 'https://maps.google.com/?q=Baga+Beach+Goa' },
      { name: 'Dudhsagar Falls', location: 'Sanguem, Goa', rating: 4.7, types: ['waterfall', 'nature'], mapsUrl: 'https://maps.google.com/?q=Dudhsagar+Falls+Goa' },
      { name: 'Old Goa Churches', location: 'Velha Goa', rating: 4.6, types: ['heritage', 'church'], mapsUrl: 'https://maps.google.com/?q=Old+Goa+Churches' },
      { name: 'Anjuna Flea Market', location: 'Anjuna, North Goa', rating: 4.3, types: ['market', 'shopping'], mapsUrl: 'https://maps.google.com/?q=Anjuna+Flea+Market' },
      { name: 'Calangute Beach', location: 'Calangute, North Goa', rating: 4.4, types: ['beach'], mapsUrl: 'https://maps.google.com/?q=Calangute+Beach+Goa' },
    ],
    manali: [
      { name: 'Rohtang Pass', location: 'Manali, Himachal Pradesh', rating: 4.6, types: ['mountain', 'nature'], mapsUrl: 'https://maps.google.com/?q=Rohtang+Pass+Manali' },
      { name: 'Solang Valley', location: 'Manali, Himachal Pradesh', rating: 4.7, types: ['adventure', 'valley'], mapsUrl: 'https://maps.google.com/?q=Solang+Valley+Manali' },
      { name: 'Hadimba Temple', location: 'Old Manali', rating: 4.5, types: ['temple', 'heritage'], mapsUrl: 'https://maps.google.com/?q=Hadimba+Temple+Manali' },
      { name: 'Jogini Waterfall', location: 'Vashisht, Manali', rating: 4.4, types: ['waterfall', 'trek'], mapsUrl: 'https://maps.google.com/?q=Jogini+Waterfall+Manali' },
      { name: 'Manu Temple', location: 'Old Manali', rating: 4.3, types: ['temple'], mapsUrl: 'https://maps.google.com/?q=Manu+Temple+Manali' },
    ],
    paris: [
      { name: 'Eiffel Tower', location: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris', rating: 4.7, types: ['landmark', 'tower'], mapsUrl: 'https://maps.google.com/?q=Eiffel+Tower+Paris' },
      { name: 'Louvre Museum', location: 'Rue de Rivoli, 75001 Paris', rating: 4.8, types: ['museum', 'art'], mapsUrl: 'https://maps.google.com/?q=Louvre+Museum+Paris' },
      { name: 'Notre-Dame Cathedral', location: 'Île de la Cité, 75004 Paris', rating: 4.7, types: ['cathedral', 'heritage'], mapsUrl: 'https://maps.google.com/?q=Notre+Dame+Paris' },
      { name: 'Sacré-Cœur Basilica', location: 'Montmartre, 75018 Paris', rating: 4.8, types: ['church', 'viewpoint'], mapsUrl: 'https://maps.google.com/?q=Sacre+Coeur+Paris' },
      { name: 'Arc de Triomphe', location: 'Place Charles de Gaulle, 75008 Paris', rating: 4.7, types: ['monument', 'landmark'], mapsUrl: 'https://maps.google.com/?q=Arc+de+Triomphe+Paris' },
    ],
    tokyo: [
      { name: 'Senso-ji Temple', location: '2-3-1 Asakusa, Taito City, Tokyo', rating: 4.7, types: ['temple', 'heritage'], mapsUrl: 'https://maps.google.com/?q=Senso-ji+Temple+Tokyo' },
      { name: 'Shibuya Crossing', location: 'Shibuya, Tokyo', rating: 4.6, types: ['landmark', 'iconic'], mapsUrl: 'https://maps.google.com/?q=Shibuya+Crossing+Tokyo' },
      { name: 'Tokyo Skytree', location: '1-1-2 Oshiage, Sumida City, Tokyo', rating: 4.5, types: ['tower', 'viewpoint'], mapsUrl: 'https://maps.google.com/?q=Tokyo+Skytree' },
      { name: 'Meiji Shrine', location: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo', rating: 4.7, types: ['shrine', 'nature'], mapsUrl: 'https://maps.google.com/?q=Meiji+Shrine+Tokyo' },
      { name: 'Tsukiji Outer Market', location: '4-16-2 Tsukiji, Chuo City, Tokyo', rating: 4.5, types: ['market', 'food'], mapsUrl: 'https://maps.google.com/?q=Tsukiji+Market+Tokyo' },
    ],
    bali: [
      { name: 'Tanah Lot Temple', location: 'Beraban, Kediri, Tabanan, Bali', rating: 4.6, types: ['temple', 'sunset'], mapsUrl: 'https://maps.google.com/?q=Tanah+Lot+Bali' },
      { name: 'Ubud Rice Terraces', location: 'Tegallalang, Ubud, Bali', rating: 4.7, types: ['nature', 'scenery'], mapsUrl: 'https://maps.google.com/?q=Tegallalang+Rice+Terrace+Bali' },
      { name: 'Kuta Beach', location: 'Kuta, Badung, Bali', rating: 4.3, types: ['beach', 'surf'], mapsUrl: 'https://maps.google.com/?q=Kuta+Beach+Bali' },
      { name: 'Sacred Monkey Forest', location: 'Jl. Monkey Forest, Ubud, Bali', rating: 4.5, types: ['nature', 'wildlife'], mapsUrl: 'https://maps.google.com/?q=Monkey+Forest+Ubud+Bali' },
      { name: 'Uluwatu Temple', location: 'Pecatu, South Kuta, Bali', rating: 4.6, types: ['temple', 'cliff'], mapsUrl: 'https://maps.google.com/?q=Uluwatu+Temple+Bali' },
    ],
  };

  for (const [key, places] of Object.entries(CURATED)) {
    if (d.includes(key)) return places.map(p => ({ ...p, source: 'curated' }));
  }
  return [];
};

export default router;
