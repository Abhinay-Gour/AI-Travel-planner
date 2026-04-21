// ── REAL BOOKING SERVICE ──
// Uses Amadeus API for flights, RapidAPI for hotels/trains

const AMADEUS_KEY = import.meta.env.VITE_AMADEUS_API_KEY || import.meta.env.VITE_AMADEUS_KEY;
const AMADEUS_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.VITE_OPENWEATHER_KEY;

// ── AMADEUS TOKEN ──
let amadeusToken = null;
let tokenExpiry = 0;

const getAmadeusToken = async () => {
  if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;
  if (!AMADEUS_KEY || AMADEUS_KEY.includes('YOUR_') || AMADEUS_KEY.includes('your_')) return null;

  try {
    const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${AMADEUS_KEY}&client_secret=${AMADEUS_SECRET}`
    });
    const data = await res.json();
    amadeusToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return amadeusToken;
  } catch {
    return null;
  }
};

// IATA city codes map
const CITY_CODES = {
  'delhi': 'DEL', 'new delhi': 'DEL', 'mumbai': 'BOM', 'bangalore': 'BLR',
  'bengaluru': 'BLR', 'chennai': 'MAA', 'kolkata': 'CCU', 'hyderabad': 'HYD',
  'goa': 'GOI', 'pune': 'PNQ', 'ahmedabad': 'AMD', 'jaipur': 'JAI',
  'kochi': 'COK', 'lucknow': 'LKO', 'indore': 'IDR', 'bhopal': 'BHO',
  'paris': 'CDG', 'london': 'LHR', 'dubai': 'DXB', 'singapore': 'SIN',
  'bangkok': 'BKK', 'tokyo': 'NRT', 'bali': 'DPS', 'new york': 'JFK',
  'sydney': 'SYD', 'kuala lumpur': 'KUL', 'hong kong': 'HKG',
};

const getCityCode = (city) => {
  const lower = city.toLowerCase().replace(/,.*/, '').trim();
  return CITY_CODES[lower] || null;
};

// ── REAL FLIGHT SEARCH (Amadeus) ──
export const searchFlights = async (from, to, date, passengers = 1) => {
  const token = await getAmadeusToken();
  const fromCode = getCityCode(from);
  const toCode = getCityCode(to);

  if (!token || !fromCode || !toCode) {
    return getFallbackFlights(from, to, date, passengers);
  }

  try {
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${fromCode}&destinationLocationCode=${toCode}&departureDate=${date}&adults=${passengers}&max=8&currencyCode=INR`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    if (!data.data?.length) return getFallbackFlights(from, to, date, passengers);

    return data.data.map(offer => {
      const seg = offer.itineraries[0].segments[0];
      const price = Math.round(parseFloat(offer.price.total));
      const depTime = new Date(seg.departure.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const arrTime = new Date(seg.arrival.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const dur = offer.itineraries[0].duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
      const stops = offer.itineraries[0].segments.length - 1;

      return {
        id: offer.id,
        carrier: seg.carrierCode,
        carrierName: getAirlineName(seg.carrierCode),
        emoji: '✈️',
        from: seg.departure.iataCode,
        to: seg.arrival.iataCode,
        time: depTime,
        arr: arrTime,
        duration: dur,
        stops: stops === 0 ? 'Non-stop' : `${stops} stop`,
        price,
        class: offer.travelerPricings[0].fareDetailsBySegment[0].cabin || 'ECONOMY',
        bookingUrl: `https://www.google.com/flights?q=flights+from+${from}+to+${to}+on+${date}`,
        realBooking: true,
      };
    });
  } catch {
    return getFallbackFlights(from, to, date, passengers);
  }
};

const getAirlineName = (code) => {
  const airlines = {
    '6E': 'IndiGo', 'AI': 'Air India', 'SG': 'SpiceJet', 'UK': 'Vistara',
    'G8': 'Go First', 'IX': 'Air Asia India', 'EK': 'Emirates',
    'QR': 'Qatar Airways', 'EY': 'Etihad', 'SQ': 'Singapore Airlines',
    'TG': 'Thai Airways', 'BA': 'British Airways', 'AF': 'Air France',
    'LH': 'Lufthansa', 'UA': 'United Airlines', 'AA': 'American Airlines',
  };
  return airlines[code] || code;
};

const getFallbackFlights = (from, to, date, passengers) => {
  const routes = {
    'DEL-BOM': [
      { carrier:'6E', carrierName:'IndiGo', emoji:'✈️', time:'06:00', arr:'08:10', duration:'2h 10m', stops:'Non-stop', price:3499, class:'Economy' },
      { carrier:'AI', carrierName:'Air India', emoji:'🛫', time:'09:30', arr:'11:45', duration:'2h 15m', stops:'Non-stop', price:4299, class:'Economy', best:true },
      { carrier:'SG', carrierName:'SpiceJet', emoji:'✈️', time:'14:00', arr:'16:20', duration:'2h 20m', stops:'Non-stop', price:2999, class:'Economy' },
      { carrier:'UK', carrierName:'Vistara', emoji:'🛫', time:'18:30', arr:'20:40', duration:'2h 10m', stops:'Non-stop', price:5499, class:'Business' },
    ],
    'DEL-GOI': [
      { carrier:'6E', carrierName:'IndiGo', emoji:'✈️', time:'07:00', arr:'09:30', duration:'2h 30m', stops:'Non-stop', price:4999, class:'Economy', best:true },
      { carrier:'AI', carrierName:'Air India', emoji:'🛫', time:'11:00', arr:'13:40', duration:'2h 40m', stops:'Non-stop', price:5799, class:'Economy' },
      { carrier:'SG', carrierName:'SpiceJet', emoji:'✈️', time:'16:00', arr:'18:45', duration:'2h 45m', stops:'Non-stop', price:3899, class:'Economy' },
    ],
    'BOM-BLR': [
      { carrier:'6E', carrierName:'IndiGo', emoji:'✈️', time:'06:30', arr:'07:55', duration:'1h 25m', stops:'Non-stop', price:2799, class:'Economy', best:true },
      { carrier:'AI', carrierName:'Air India', emoji:'🛫', time:'10:00', arr:'11:30', duration:'1h 30m', stops:'Non-stop', price:3499, class:'Economy' },
    ],
  };

  const fromCode = getCityCode(from) || 'DEL';
  const toCode = getCityCode(to) || 'BOM';
  const key = `${fromCode}-${toCode}`;
  const revKey = `${toCode}-${fromCode}`;

  return (routes[key] || routes[revKey] || routes['DEL-BOM']).map((f, i) => ({
    ...f,
    id: `fallback-${i}`,
    from: fromCode,
    to: toCode,
    bookingUrl: `https://www.makemytrip.com/flights/search?tripType=O&itinerary=${fromCode}-${toCode}-${date}&paxType=A-${passengers}_C-0_I-0`,
    realBooking: false,
  }));
};

// ── REAL HOTEL SEARCH (RapidAPI - Booking.com) ──
export const searchHotels = async (city, checkIn, checkOut, guests = 2) => {
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes('YOUR_') || RAPIDAPI_KEY.includes('your_')) {
    return getFallbackHotels(city);
  }

  try {
    // Get destination ID first
    const destRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(city)}&locale=en-gb`,
      { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' } }
    );
    const destData = await destRes.json();
    if (!destData?.[0]?.dest_id) return getFallbackHotels(city);

    const destId = destData[0].dest_id;
    const destType = destData[0].dest_type;

    const hotelsRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destId}&dest_type=${destType}&checkin_date=${checkIn}&checkout_date=${checkOut}&adults_number=${guests}&room_number=1&order_by=popularity&filter_by_currency=INR&locale=en-gb&units=metric`,
      { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' } }
    );
    const hotelsData = await hotelsRes.json();

    if (!hotelsData?.result?.length) return getFallbackHotels(city);

    return hotelsData.result.slice(0, 12).map(h => ({
      id: h.hotel_id,
      name: h.hotel_name,
      city,
      location: h.address || city,
      stars: h.class || 3,
      rating: h.review_score || 8.0,
      reviews: h.review_nr || 500,
      price: Math.round(h.min_total_price || h.price_breakdown?.gross_price || 3000),
      img: h.main_photo_url?.replace('square60', 'square500') || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
      amenities: ['WiFi', 'AC', 'Restaurant'].concat(h.is_free_cancellable ? ['Free Cancel'] : []),
      badge: h.is_genius_deal ? 'Genius Deal' : '',
      bookingUrl: `https://www.booking.com/hotel/${h.hotel_id}.html`,
      realBooking: true,
    }));
  } catch {
    return getFallbackHotels(city);
  }
};

const getFallbackHotels = (city) => {
  const HOTELS = [
    { id:1, name:'The Leela Palace', city:'Delhi', location:'Chanakyapuri', stars:5, rating:9.2, reviews:2841, price:12500, img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop', amenities:['Pool','Spa','WiFi','Gym'], badge:'Luxury', bookingUrl:'https://www.booking.com/searchresults.html?ss=Delhi' },
    { id:2, name:'Taj Mahal Hotel', city:'Mumbai', location:'Colaba', stars:5, rating:9.4, reviews:4120, price:18000, img:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=200&fit=crop', amenities:['Pool','Spa','WiFi','Bar'], badge:'Iconic', bookingUrl:'https://www.booking.com/searchresults.html?ss=Mumbai' },
    { id:3, name:'Zostel Goa', city:'Goa', location:'Anjuna', stars:2, rating:8.1, reviews:1560, price:800, img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=200&fit=crop', amenities:['WiFi','Kitchen','Lockers'], badge:'Budget', bookingUrl:'https://www.booking.com/searchresults.html?ss=Goa' },
    { id:4, name:'The Oberoi Udaivilas', city:'Udaipur', location:'Lake Pichola', stars:5, rating:9.6, reviews:3200, price:35000, img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=200&fit=crop', amenities:['Pool','Spa','WiFi','Boat'], badge:'Best Rated', bookingUrl:'https://www.booking.com/searchresults.html?ss=Udaipur' },
    { id:5, name:'Ibis Styles Jaipur', city:'Jaipur', location:'MI Road', stars:3, rating:8.3, reviews:980, price:2800, img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=200&fit=crop', amenities:['WiFi','Restaurant','AC'], badge:'', bookingUrl:'https://www.booking.com/searchresults.html?ss=Jaipur' },
    { id:6, name:'Snow Valley Resorts', city:'Manali', location:'Old Manali', stars:3, rating:8.5, reviews:720, price:3500, img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=200&fit=crop', amenities:['WiFi','Bonfire','Mountain View'], badge:'Nature Stay', bookingUrl:'https://www.booking.com/searchresults.html?ss=Manali' },
    { id:7, name:'Radisson Blu', city:'Bangalore', location:'Outer Ring Road', stars:4, rating:8.7, reviews:2100, price:6500, img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=200&fit=crop', amenities:['Pool','WiFi','Gym','Restaurant'], badge:'', bookingUrl:'https://www.booking.com/searchresults.html?ss=Bangalore' },
    { id:8, name:'Moustache Hostel', city:'Rishikesh', location:'Tapovan', stars:2, rating:8.9, reviews:3400, price:600, img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop', amenities:['WiFi','Yoga','River View'], badge:'Traveller Fav', bookingUrl:'https://www.booking.com/searchresults.html?ss=Rishikesh' },
  ];

  const cityLower = city.toLowerCase();
  const matched = HOTELS.filter(h => h.city.toLowerCase().includes(cityLower) || cityLower.includes(h.city.toLowerCase()));
  return matched.length > 0 ? matched : HOTELS;
};

// ── REAL TRAIN SEARCH (RapidAPI IRCTC) ──
export const searchTrains = async (from, to, date) => {
  if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes('YOUR_') || RAPIDAPI_KEY.includes('your_')) {
    return getFallbackTrains(from, to);
  }

  try {
    const res = await fetch(
      `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${getStationCode(from)}&toStationCode=${getStationCode(to)}&dateOfJourney=${date}`,
      { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'irctc1.p.rapidapi.com' } }
    );
    const data = await res.json();

    if (!data?.data?.length) return getFallbackTrains(from, to);

    return data.data.slice(0, 6).map(t => ({
      id: t.train_number,
      carrier: t.train_name,
      emoji: '🚆',
      trainNo: t.train_number,
      time: t.from_std,
      arr: t.to_std,
      duration: t.duration,
      stops: 'Multiple stops',
      price: getTrainPrice(t.train_name),
      class: '3A AC',
      bookingUrl: `https://www.irctc.co.in/nget/train-search`,
      realBooking: true,
    }));
  } catch {
    return getFallbackTrains(from, to);
  }
};

const STATION_CODES = {
  'delhi': 'NDLS', 'new delhi': 'NDLS', 'mumbai': 'CSTM', 'bangalore': 'SBC',
  'bengaluru': 'SBC', 'chennai': 'MAS', 'kolkata': 'HWH', 'hyderabad': 'SC',
  'goa': 'MAO', 'pune': 'PUNE', 'ahmedabad': 'ADI', 'jaipur': 'JP',
  'indore': 'INDB', 'bhopal': 'BPL', 'lucknow': 'LKO', 'varanasi': 'BSB',
};

const getStationCode = (city) => {
  const lower = city.toLowerCase().replace(/,.*/, '').trim();
  return STATION_CODES[lower] || 'NDLS';
};

const getTrainPrice = (name) => {
  if (name?.includes('Rajdhani')) return 1755;
  if (name?.includes('Shatabdi')) return 1200;
  if (name?.includes('Duronto')) return 2045;
  if (name?.includes('Vande')) return 1500;
  return Math.floor(Math.random() * 1000) + 800;
};

const getFallbackTrains = (from, to) => [
  { id:'12951', carrier:'Rajdhani Express', emoji:'🚄', trainNo:'12951', time:'16:55', arr:'08:35+1', duration:'15h 40m', stops:'5 stops', price:1755, class:'3A AC', best:true, bookingUrl:'https://www.irctc.co.in/nget/train-search', realBooking:false },
  { id:'12213', carrier:'Duronto Express', emoji:'🚆', trainNo:'12213', time:'23:00', arr:'14:45+1', duration:'15h 45m', stops:'Non-stop', price:2045, class:'2A AC', bookingUrl:'https://www.irctc.co.in/nget/train-search', realBooking:false },
  { id:'12001', carrier:'Shatabdi Express', emoji:'🚄', trainNo:'12001', time:'06:00', arr:'13:55', duration:'7h 55m', stops:'4 stops', price:1200, class:'CC', bookingUrl:'https://www.irctc.co.in/nget/train-search', realBooking:false },
  { id:'22439', carrier:'Vande Bharat Express', emoji:'🚄', trainNo:'22439', time:'06:00', arr:'14:00', duration:'8h', stops:'3 stops', price:1500, class:'EC', best:true, bookingUrl:'https://www.irctc.co.in/nget/train-search', realBooking:false },
];

// ── REAL BUS SEARCH (RapidAPI RedBus) ──
export const searchBuses = async (from, to, date) => {
  // RedBus API requires paid plan — using smart fallback with real booking links
  return getFallbackBuses(from, to, date);
};

const getFallbackBuses = (from, to, date) => {
  const dateStr = date || new Date().toISOString().split('T')[0];
  const fromEnc = encodeURIComponent(from);
  const toEnc = encodeURIComponent(to);

  return [
    { id:'b1', carrier:'VRL Travels', emoji:'🚌', time:'18:00', arr:'14:00+1', duration:'20h', stops:'AC Sleeper', price:1299, class:'AC Sleeper', best:true, bookingUrl:`https://www.redbus.in/bus-tickets/${fromEnc.toLowerCase()}-to-${toEnc.toLowerCase()}`, realBooking:true },
    { id:'b2', carrier:'Orange Travels', emoji:'🚌', time:'20:00', arr:'16:00+1', duration:'20h', stops:'AC Seater', price:899, class:'AC Seater', bookingUrl:`https://www.redbus.in/bus-tickets/${fromEnc.toLowerCase()}-to-${toEnc.toLowerCase()}`, realBooking:true },
    { id:'b3', carrier:'SRS Travels', emoji:'🚌', time:'21:00', arr:'17:00+1', duration:'20h', stops:'Non-AC', price:599, class:'Non-AC Sleeper', bookingUrl:`https://www.redbus.in/bus-tickets/${fromEnc.toLowerCase()}-to-${toEnc.toLowerCase()}`, realBooking:true },
    { id:'b4', carrier:'Paulo Travels', emoji:'🚌', time:'17:00', arr:'13:00+1', duration:'20h', stops:'Luxury', price:1899, class:'Luxury AC', bookingUrl:`https://www.redbus.in/bus-tickets/${fromEnc.toLowerCase()}-to-${toEnc.toLowerCase()}`, realBooking:true },
  ];
};

// ── REAL WEATHER (OpenWeatherMap) ──
export const fetchRealWeather = async (city) => {
  if (!WEATHER_KEY || WEATHER_KEY === 'YOUR_OPENWEATHER_KEY_HERE') return null;

  try {
    // Get current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&units=metric`
    );
    const currentData = await currentRes.json();
    if (currentData.cod !== 200) return null;

    // Get 5-day forecast (free tier: 3-hour intervals, 40 entries)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&units=metric&cnt=40`
    );
    const forecastData = await forecastRes.json();

    // Pick one entry per day (every 8th = 24h apart)
    const forecast = (forecastData.list || [])
      .filter((_, i) => i % 8 === 0)
      .slice(0, 7)
      .map(d => ({
        day: new Date(d.dt * 1000).toLocaleDateString('en-IN', { weekday: 'short' }),
        icon: getWeatherEmoji(d.weather[0].main),
        high: Math.round(d.main.temp_max),
        low: Math.round(d.main.temp_min),
      }));

    return {
      icon: getWeatherEmoji(currentData.weather[0].main),
      temp: Math.round(currentData.main.temp),
      desc: currentData.weather[0].description,
      humidity: `${currentData.main.humidity}%`,
      wind: `${Math.round(currentData.wind.speed * 3.6)} km/h`,
      uv: 'Moderate',
      forecast: forecast.length > 0 ? forecast : null,
      realData: true,
    };
  } catch {
    return null;
  }
};

const getWeatherEmoji = (main) => {
  const map = { Clear:'☀️', Clouds:'⛅', Rain:'🌧️', Drizzle:'🌦️', Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Fog:'🌫️' };
  return map[main] || '🌤️';
};
