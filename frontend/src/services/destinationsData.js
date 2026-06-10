const destinationsData = {
  kashmir: {
    airport: "Sheikh ul-Alam International Airport, Srinagar",
    hotels: ["The Lalit Grand Palace", "Vivanta Dal View", "Houseboat on Dal Lake", "Hotel Broadway", "Grand Mumtaz Resort"],
    restaurants: ["Ahdoos Restaurant", "Mughal Darbar", "Shamyana Restaurant", "Lhasa Restaurant", "Stream Restaurant"],
    places: ["Dal Lake", "Nagin Lake", "Shalimar Bagh", "Nishat Bagh", "Chashme Shahi", "Shankaracharya Temple", "Hazratbal Mosque", "Lal Chowk", "Polo View Market", "Pari Mahal", "Gulmarg", "Gondola Cable Car", "Apharwat Peak", "Pahalgam", "Betaab Valley", "Aru Valley", "Lidder River", "Sonamarg", "Thajiwas Glacier"],
    food: ["Rogan Josh", "Wazwan", "Gushtaba", "Yakhni", "Dum Aloo Kashmiri", "Kashmiri Kahwa", "Sheer Chai", "Modur Pulao"],
    shopping: ["Pashmina shawls from Lal Chowk", "Kashmiri saffron from Polo View Market", "Walnut wood handicrafts", "Kashmiri carpets", "Papier-mache items"]
  },
  goa: {
    airport: "Goa International Airport (Manohar Airport), Mopa",
    hotels: ["Taj Exotica Resort & Spa", "The Leela Goa", "Grand Hyatt Goa", "Aloft North Goa", "Hotel Baga Marina"],
    restaurants: ["Fisherman's Wharf", "Thalassa Greek Restaurant", "Britto's Beach Shack", "Gunpowder Restaurant", "Martin's Corner"],
    places: ["Baga Beach", "Calangute Beach", "Anjuna Beach", "Palolem Beach", "Basilica of Bom Jesus", "Se Cathedral", "Chapora Fort", "Dudhsagar Waterfalls", "Anjuna Flea Market", "Saturday Night Market Arpora", "Aguada Fort", "Vagator Beach"],
    food: ["Goan Fish Curry Rice", "Prawn Balchão", "Bebinca", "Sorpotel", "Caldo Verde", "Feni"],
    shopping: ["Cashews from Mapusa Market", "Spices from Anjuna Flea Market", "Azulejos tiles", "Feni bottles", "Handicrafts from Saturday Night Market"]
  },
  jaipur: {
    airport: "Jaipur International Airport (Sanganer Airport)",
    hotels: ["Rambagh Palace", "Taj Hotel & Convention Centre", "ITC Rajputana", "Hotel Pearl Palace", "Samode Haveli"],
    restaurants: ["Suvarna Mahal at Rambagh Palace", "1135 AD at Amber Fort", "Laxmi Mishtan Bhandar (LMB)", "Peacock Rooftop Restaurant", "Niro's Restaurant"],
    places: ["Amber Fort", "Nahargarh Fort", "Jaigarh Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Johari Bazaar", "Bapu Bazaar", "Albert Hall Museum", "Jal Mahal", "Birla Mandir", "Chokhi Dhani"],
    food: ["Dal Baati Churma", "Laal Maas", "Gatte ki Sabzi", "Pyaaz Kachori from LMB", "Ghevar", "Mawa Kachori"],
    shopping: ["Blue pottery from Kripal Kumbh", "Bandhani fabric from Johari Bazaar", "Gemstones from Gem Bazaar", "Mojari shoes from Bapu Bazaar", "Miniature paintings"]
  },
  mumbai: {
    airport: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
    hotels: ["The Taj Mahal Palace", "Oberoi Mumbai", "ITC Grand Central", "Trident Nariman Point", "Hotel Marine Plaza"],
    restaurants: ["Trishna Restaurant", "Khyber Restaurant", "Cafe Mondegar", "Leopold Cafe", "Britannia & Co Restaurant"],
    places: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus", "Colaba Causeway", "Bandra-Worli Sea Link", "Juhu Beach", "Siddhivinayak Temple", "Haji Ali Dargah", "Dharavi", "Crawford Market", "Nariman Point"],
    food: ["Vada Pav from Ashok Vada Pav", "Pav Bhaji from Sardar Pav Bhaji", "Bombay Sandwich", "Keema Pav", "Modak", "Sol Kadhi"],
    shopping: ["Colaba Causeway Market", "Chor Bazaar", "Fashion Street", "Linking Road Bandra", "Crawford Market spices"]
  },
  delhi: {
    airport: "Indira Gandhi International Airport, New Delhi",
    hotels: ["The Imperial New Delhi", "Taj Mahal Hotel New Delhi", "ITC Maurya", "The Leela Palace New Delhi", "Hotel Bloomrooms"],
    restaurants: ["Bukhara at ITC Maurya", "Indian Accent", "Karim's in Jama Masjid", "Paranthe Wali Gali", "Sagar Ratna"],
    places: ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb", "Jama Masjid", "Lotus Temple", "Akshardham Temple", "Chandni Chowk", "Connaught Place", "Lodi Garden", "Hauz Khas Village", "National Museum"],
    food: ["Butter Chicken from Moti Mahal", "Chole Bhature from Sita Ram Diwan Chand", "Paranthe from Paranthe Wali Gali", "Biryani from Karim's", "Daulat ki Chaat"],
    shopping: ["Chandni Chowk for spices and fabrics", "Dilli Haat for handicrafts", "Sarojini Nagar Market", "Janpath Market", "Lajpat Nagar Central Market"]
  },
  agra: {
    airport: "Agra Airport (Pandit Deen Dayal Upadhyay Airport)",
    hotels: ["The Oberoi Amarvilas", "Taj Hotel & Convention Centre Agra", "ITC Mughal Agra", "Crystal Sarovar Premiere", "Hotel Amar"],
    restaurants: ["Pinch of Spice", "Esphahan at Oberoi Amarvilas", "Dasaprakash Restaurant", "Peshawri at ITC Mughal", "Mama Chicken Mama Franky"],
    places: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Itmad-ud-Daulah (Baby Taj)", "Mehtab Bagh", "Jama Masjid Agra", "Kinari Bazaar", "Sadar Bazaar", "Akbar's Tomb Sikandra"],
    food: ["Petha from Panchhi Petha Store", "Agra ka Dalmoth", "Bedai Jalebi", "Mughlai Biryani"],
    shopping: ["Petha from Panchhi Petha", "Marble inlay work from Kinari Bazaar", "Leather goods from Sadar Bazaar", "Carpets from Agra"]
  },
  varanasi: {
    airport: "Lal Bahadur Shastri International Airport, Varanasi",
    hotels: ["Brijrama Palace", "Taj Ganges Varanasi", "Radisson Hotel Varanasi", "Hotel Surya", "Rashmi Guest House"],
    restaurants: ["Pizzeria Vaatika Cafe", "Aadha-Aadha Restaurant", "Keshari Restaurant", "Brown Bread Bakery", "Dosa Cafe"],
    places: ["Dashashwamedh Ghat", "Manikarnika Ghat", "Assi Ghat", "Kashi Vishwanath Temple", "Sarnath", "Ramnagar Fort", "Tulsi Manas Temple", "Bharat Mata Mandir", "Vishwanath Lane", "Ganga Aarti"],
    food: ["Baati Chokha", "Kachori Sabzi from Kashi Chat Bhandar", "Thandai", "Malaiyo", "Litti Chokha"],
    shopping: ["Banarasi silk sarees from Vishwanath Lane", "Wooden toys", "Brassware", "Rudraksha beads"]
  },
  manali: {
    airport: "Bhuntar Airport (Kullu-Manali Airport)",
    hotels: ["Span Resort & Spa", "The Himalayan", "Sterling Manali", "Hotel Rohtang Residency", "Apple Country Resort"],
    restaurants: ["Johnson's Cafe", "Drifters' Inn", "Cafe 1947", "Chopsticks Restaurant", "Lazy Dog Lounge"],
    places: ["Rohtang Pass", "Solang Valley", "Hadimba Devi Temple", "Manu Temple", "Old Manali", "Beas River", "Naggar Castle", "Great Himalayan National Park", "Kullu Valley", "Bhrigu Lake"],
    food: ["Siddu", "Trout Fish", "Dham", "Babru", "Chha Gosht"],
    shopping: ["Woolen shawls from Mall Road", "Kullu caps", "Tibetan artifacts", "Apple products from local orchards"]
  },
  kerala: {
    airport: "Cochin International Airport, Kochi",
    hotels: ["Taj Malabar Resort & Spa Kochi", "Kumarakom Lake Resort", "Spice Village CGH Earth", "The Leela Kovalam", "Casino Hotel Kochi"],
    restaurants: ["Fort House Restaurant Kochi", "Dhe Puttu Restaurant", "Malabar Junction", "Rice Boat Restaurant", "Paragon Restaurant Kozhikode"],
    places: ["Alleppey Backwaters", "Kumarakom Bird Sanctuary", "Munnar Tea Gardens", "Periyar Wildlife Sanctuary", "Fort Kochi", "Varkala Cliff Beach", "Kovalam Beach", "Athirapally Waterfalls", "Wayanad Wildlife Sanctuary", "Padmanabhaswamy Temple Thiruvananthapuram"],
    food: ["Kerala Sadya", "Karimeen Pollichathu", "Appam with Stew", "Kerala Prawn Curry", "Puttu Kadala Curry", "Kerala Fish Molee"],
    shopping: ["Kasavu sarees from Balaramapuram", "Spices from Mattancherry", "Coir products", "Rosewood handicrafts", "Kathakali masks"]
  },
  andaman: {
    airport: "Veer Savarkar International Airport, Port Blair",
    hotels: ["Taj Exotica Resort & Spa Andamans", "Sea Shell Port Blair", "Fortune Resort Bay Island", "Munjoh Ocean Resort Havelock", "Symphony Palms Beach Resort"],
    restaurants: ["Annapurna Cafeteria", "Icy Spicy Restaurant", "New Lighthouse Restaurant", "Mandalay Restaurant", "Full Moon Cafe Havelock"],
    places: ["Radhanagar Beach (Havelock Island)", "Cellular Jail", "Ross Island", "Neil Island", "Baratang Island", "Mahatma Gandhi Marine National Park", "Chidiya Tapu", "North Bay Island", "Jolly Buoy Island", "Wandoor Beach"],
    food: ["Fish Curry", "Grilled Lobster", "Coconut Prawn Curry", "Red Snapper", "Bamboo Shoot Curry"],
    shopping: ["Seashell crafts", "Coral jewelry", "Wood carvings", "Shell lamps from Aberdeen Bazaar"]
  },
  paris: {
    airport: "Charles de Gaulle Airport (CDG), Paris",
    hotels: ["Le Meurice", "Hotel Plaza Athenee", "Shangri-La Paris", "The Ritz Paris", "Hotel Lutetia"],
    restaurants: ["Le Jules Verne at Eiffel Tower", "Cafe de Flore", "L'Ami Louis", "Septime", "Au Pied de Cochon"],
    places: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Musee d'Orsay", "Champs-Elysees", "Arc de Triomphe", "Montmartre & Sacre-Coeur", "Palace of Versailles", "Seine River Cruise", "Le Marais", "Sainte-Chapelle", "Luxembourg Gardens"],
    food: ["Croissant from Poilane Bakery", "Macarons from Laduree", "Croque Monsieur", "French Onion Soup", "Steak Frites", "Crepes from Montmartre"],
    shopping: ["Galeries Lafayette", "Le Bon Marche", "Rue du Faubourg Saint-Honore", "Marche aux Puces de Saint-Ouen", "Souvenirs from Eiffel Tower"]
  },
  tokyo: {
    airport: "Narita International Airport / Haneda Airport, Tokyo",
    hotels: ["The Peninsula Tokyo", "Park Hyatt Tokyo", "Andaz Tokyo Toranomon Hills", "Hotel Gajoen Tokyo", "Shinjuku Granbell Hotel"],
    restaurants: ["Sukiyabashi Jiro Honten", "Ichiran Ramen Shibuya", "Tsukiji Outer Market", "Gonpachi Nishi-Azabu", "Tempura Kondo"],
    places: ["Senso-ji Temple Asakusa", "Shibuya Crossing", "Shinjuku Gyoen", "Tokyo Tower", "Akihabara Electric Town", "Meiji Shrine", "teamLab Borderless", "Tsukiji Fish Market", "Odaiba", "Ueno Park & Zoo", "Harajuku Takeshita Street", "Tokyo Skytree"],
    food: ["Sushi at Tsukiji Market", "Ramen at Ichiran", "Tempura at Tempura Kondo", "Yakitori at Yurakucho", "Wagyu Beef", "Matcha desserts at Harajuku"],
    shopping: ["Akihabara for electronics", "Harajuku for fashion", "Shibuya 109", "Don Quijote", "Nakamise Shopping Street Asakusa"]
  },
  bali: {
    airport: "Ngurah Rai International Airport, Denpasar",
    hotels: ["Four Seasons Resort Bali at Sayan", "COMO Uma Ubud", "The Mulia Nusa Dua", "Alaya Resort Ubud", "Potato Head Beach Club Seminyak"],
    restaurants: ["Locavore Ubud", "Merah Putih Seminyak", "Swept Away at COMO Shambhala", "Naughty Nuri's Warung", "Sarong Restaurant"],
    places: ["Tanah Lot Temple", "Uluwatu Temple", "Tegallalang Rice Terraces", "Sacred Monkey Forest Ubud", "Kuta Beach", "Seminyak Beach", "Mount Batur", "Tirta Empul Temple", "Ubud Palace", "Besakih Temple", "Nusa Penida Island", "GWK Cultural Park"],
    food: ["Babi Guling at Ibu Oka", "Bebek Betutu", "Nasi Goreng", "Satay Lilit", "Lawar", "Black Rice Pudding"],
    shopping: ["Ubud Art Market", "Seminyak boutiques", "Kuta Square", "Silver jewelry from Celuk village", "Wood carvings from Mas village"]
  },
  singapore: {
    airport: "Changi Airport, Singapore",
    hotels: ["Marina Bay Sands", "Raffles Hotel Singapore", "The Fullerton Hotel", "Capella Singapore Sentosa", "Park Royal Collection Marina Bay"],
    restaurants: ["Hawker Chan (Liao Fan)", "Long Beach Seafood Restaurant", "Burnt Ends", "Odette", "Newton Food Centre"],
    places: ["Marina Bay Sands SkyPark", "Gardens by the Bay", "Sentosa Island", "Universal Studios Singapore", "Singapore Zoo", "Orchard Road", "Chinatown", "Little India", "Clarke Quay", "Merlion Park", "ArtScience Museum", "Jewel Changi Airport"],
    food: ["Chilli Crab at Long Beach", "Hainanese Chicken Rice at Tian Tian", "Laksa at 328 Katong Laksa", "Char Kway Teow", "Roti Prata", "Durian from Geylang"],
    shopping: ["Orchard Road malls", "ION Orchard", "Bugis Street", "Mustafa Centre Little India", "VivoCity"]
  },
  dubai: {
    airport: "Dubai International Airport (DXB)",
    hotels: ["Burj Al Arab Jumeirah", "Atlantis The Palm", "Armani Hotel Dubai", "One&Only Royal Mirage", "Address Downtown Dubai"],
    restaurants: ["Nobu Dubai", "At.mosphere at Burj Khalifa", "Pierchic", "Arabian Tea House", "Bu Qtair Fish Restaurant"],
    places: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Creek", "Gold Souk Deira", "Spice Souk", "Dubai Frame", "Museum of the Future", "Miracle Garden", "Global Village", "Dubai Marina", "Jumeirah Beach"],
    food: ["Al Harees", "Machboos", "Luqaimat", "Camel Burger at Switch", "Shawarma from Ravi Restaurant", "Knafeh"],
    shopping: ["Dubai Mall", "Mall of the Emirates", "Gold Souk Deira", "Spice Souk Bur Dubai", "City Walk"]
  },
  bangkok: {
    airport: "Suvarnabhumi Airport, Bangkok",
    hotels: ["Mandarin Oriental Bangkok", "The Peninsula Bangkok", "Capella Bangkok", "SO/ Bangkok", "Chatrium Hotel Riverside"],
    restaurants: ["Gaggan Anand", "Jay Fai", "Bo.lan", "Ruen Mallika", "Polo Fried Chicken"],
    places: ["Grand Palace", "Wat Phra Kaew (Temple of the Emerald Buddha)", "Wat Arun", "Wat Pho", "Chatuchak Weekend Market", "Floating Market Damnoen Saduak", "Khao San Road", "Lumpini Park", "Asiatique The Riverfront", "Jim Thompson House", "MBK Center", "Erawan Shrine"],
    food: ["Pad Thai at Thip Samai", "Tom Yum Goong", "Mango Sticky Rice", "Som Tum", "Massaman Curry", "Thai Boat Noodles"],
    shopping: ["Chatuchak Weekend Market", "MBK Center", "Siam Paragon", "Pratunam Market", "Asiatique Night Market"]
  },
  istanbul: {
    airport: "Istanbul Airport (IST)",
    hotels: ["Four Seasons Hotel Istanbul at Sultanahmet", "Ciragan Palace Kempinski", "Pera Palace Hotel", "The Ritz-Carlton Istanbul", "Soho House Istanbul"],
    restaurants: ["Mikla Restaurant", "Nusret Istanbul (Salt Bae)", "Karakoy Gulluoglu", "Hamdi Restaurant", "Ciya Sofrasi"],
    places: ["Hagia Sophia", "Blue Mosque (Sultan Ahmed Mosque)", "Topkapi Palace", "Grand Bazaar", "Spice Bazaar", "Bosphorus Cruise", "Galata Tower", "Dolmabahce Palace", "Basilica Cistern", "Taksim Square", "Istiklal Avenue", "Princes Islands"],
    food: ["Iskender Kebab", "Baklava from Karakoy Gulluoglu", "Simit", "Doner Kebab", "Turkish Delight from Grand Bazaar", "Manti"],
    shopping: ["Grand Bazaar", "Spice Bazaar", "Istiklal Avenue", "Nisantasi for luxury", "Arasta Bazaar"]
  },
  barcelona: {
    airport: "Barcelona–El Prat Airport (BCN)",
    hotels: ["Hotel Arts Barcelona", "W Barcelona", "Mandarin Oriental Barcelona", "Hotel Casa Camper", "Cotton House Hotel"],
    restaurants: ["Tickets (Albert Adria)", "Bar Cañete", "La Boqueria Market stalls", "Cerveceria Catalana", "Bodega Sepulveda"],
    places: ["Sagrada Familia", "Park Guell", "Casa Batllo", "La Rambla", "Gothic Quarter", "Barceloneta Beach", "Camp Nou", "Palau de la Musica Catalana", "Montjuic Castle", "Picasso Museum", "La Boqueria Market", "Casa Mila (La Pedrera)"],
    food: ["Patatas Bravas", "Pan con Tomate", "Jamon Iberico", "Paella at Barceloneta", "Crema Catalana", "Croquetas"],
    shopping: ["La Boqueria Market", "Passeig de Gracia", "El Born boutiques", "Mercat de Sant Antoni", "El Corte Ingles"]
  },
  rome: {
    airport: "Leonardo da Vinci International Airport (Fiumicino), Rome",
    hotels: ["Hotel Hassler Roma", "The St. Regis Rome", "Hotel de Russie", "J.K. Place Roma", "Inn at the Roman Forum"],
    restaurants: ["La Pergola", "Roscioli Restaurant", "Da Enzo al 29", "Tonnarello Trastevere", "Supplì Roma"],
    places: ["Colosseum", "Roman Forum", "Vatican Museums", "Sistine Chapel", "St. Peter's Basilica", "Trevi Fountain", "Spanish Steps", "Pantheon", "Borghese Gallery", "Trastevere", "Campo de' Fiori", "Castel Sant'Angelo"],
    food: ["Cacio e Pepe at Roscioli", "Carbonara at Da Enzo", "Suppli from Supplì Roma", "Gelato from Giolitti", "Tiramisu", "Pizza al Taglio"],
    shopping: ["Via Condotti for luxury", "Campo de Fiori market", "Porta Portese flea market", "Via del Corso", "Trastevere artisan shops"]
  },
  london: {
    airport: "Heathrow Airport (LHR), London",
    hotels: ["The Savoy", "Claridge's Hotel", "The Ritz London", "Rosewood London", "The Ned London"],
    restaurants: ["Sketch London", "Dishoom Carnaby", "The Fat Duck Bray", "Gordon Ramsay Restaurant", "Flat Iron Covent Garden"],
    places: ["Tower of London", "Buckingham Palace", "British Museum", "Westminster Abbey", "Big Ben & Houses of Parliament", "Tower Bridge", "Hyde Park", "Tate Modern", "Covent Garden", "Borough Market", "The Shard", "National Gallery"],
    food: ["Fish & Chips from Poppies Fish & Chips", "Full English Breakfast", "Chicken Tikka Masala", "Afternoon Tea at Claridge's", "Beef Wellington", "Sticky Toffee Pudding"],
    shopping: ["Harrods Knightsbridge", "Oxford Street", "Portobello Road Market", "Carnaby Street", "Borough Market"]
  },
  "new york": {
    airport: "John F. Kennedy International Airport (JFK) / LaGuardia Airport (LGA)",
    hotels: ["The Plaza Hotel", "Four Seasons Hotel New York", "The Mandarin Oriental New York", "1 Hotel Central Park", "The Standard High Line"],
    restaurants: ["Le Bernardin", "Katz's Delicatessen", "Peter Luger Steak House", "Shake Shack Madison Square Park", "Grimaldi's Pizzeria Brooklyn"],
    places: ["Statue of Liberty & Ellis Island", "Central Park", "Empire State Building", "Metropolitan Museum of Art", "Times Square", "Brooklyn Bridge", "The High Line", "9/11 Memorial & Museum", "One World Observatory", "Rockefeller Center", "Grand Central Terminal", "MOMA"],
    food: ["New York Bagel from Ess-a-Bagel", "Pizza from Di Fara Pizza Brooklyn", "Pastrami from Katz's Deli", "Cheesecake from Junior's", "Hot Dog from Gray's Papaya"],
    shopping: ["Fifth Avenue", "SoHo boutiques", "Chelsea Market", "Macy's Herald Square", "Brooklyn Flea Market"]
  },
  maldives: {
    airport: "Velana International Airport, Male",
    hotels: ["Gili Lankanfushi", "Soneva Jani", "Six Senses Laamu", "Anantara Veli Maldives", "Coco Bodu Hithi"],
    restaurants: ["Ithaa Undersea Restaurant at Conrad", "SEA Restaurant at Anantara", "Celsius at Coco Palm Dhuni Kolhu", "Muraka Restaurant", "Turquoise Restaurant"],
    places: ["Male City", "Maafushi Island", "Banana Reef", "HP Reef", "Hanifaru Bay", "Vaadhoo Island (Sea of Stars)", "Hulhumale Beach", "National Museum Male", "Utheemu Ganduvaru"],
    food: ["Garudhiya (Tuna Soup)", "Mas Huni", "Bis Keemiya", "Fihunu Mas (Grilled Fish)", "Roshi"],
    shopping: ["Local Market Male", "Majeedhee Magu shopping street", "Chaandhanee Magu", "Souvenir shops at resorts"]
  },
  kyoto: {
    airport: "Kansai International Airport / Osaka Itami Airport",
    hotels: ["Aman Kyoto", "The Ritz-Carlton Kyoto", "Four Seasons Hotel Kyoto", "Tawaraya Ryokan", "Gion Hatanaka Ryokan"],
    restaurants: ["Kikunoi Honten", "Nishiki Market stalls", "Tofu Kaiseki Junsei", "Kagizen Yoshifusa", "Hafuu Honten"],
    places: ["Fushimi Inari Taisha", "Kinkaku-ji (Golden Pavilion)", "Arashiyama Bamboo Grove", "Gion District", "Kiyomizu-dera Temple", "Nijo Castle", "Nishiki Market", "Philosopher's Path", "Tenryu-ji Temple", "Heian Shrine", "Ryoan-ji Rock Garden", "Pontocho Alley"],
    food: ["Kaiseki at Kikunoi", "Yudofu (Tofu Hot Pot)", "Matcha everything at Nishiki", "Obanzai", "Kyoto-style Ramen", "Yatsuhashi sweets"],
    shopping: ["Nishiki Market", "Gion Higashiyama shops", "Kyoto Handicraft Center", "Teramachi Shopping Street", "Arashiyama souvenir shops"]
  },
  shimla: {
    airport: "Jubbarhatti Airport, Shimla",
    hotels: ["Wildflower Hall by Oberoi", "The Cecil Hotel Shimla", "Radisson Hotel Shimla", "Hotel Combermere", "Woodville Palace Hotel"],
    restaurants: ["Cafe Sol", "Indian Coffee House Shimla", "Wake & Bake Cafe", "Baljees Restaurant", "Eighteen 71 Cafe"],
    places: ["Mall Road", "Jakhu Temple", "Christ Church", "The Ridge", "Kufri", "Chadwick Falls", "Shimla State Museum", "Viceregal Lodge (Institute of Advanced Studies)", "Annandale Ground", "Glen Forest"],
    food: ["Chha Gosht", "Siddu", "Dham", "Babru", "Trout Fish from Angler's Inn"],
    shopping: ["Mall Road for woolens", "Lakkar Bazaar for wooden crafts", "Tibetan market Scandal Point", "Local jam and honey"]
  }
};

export const getDestinationData = (destination) => {
  const d = destination.toLowerCase();
  for (const [key, data] of Object.entries(destinationsData)) {
    if (d.includes(key) || key.includes(d)) return { key, ...data };
  }
  return null;
};

export const buildReferencePrompt = (destination) => {
  const data = getDestinationData(destination);
  if (!data) return '';
  return `
REAL REFERENCE DATA FOR ${destination.toUpperCase()} (use these exact names):
- Airport: ${data.airport}
- Hotels: ${data.hotels.join(', ')}
- Restaurants: ${data.restaurants.join(', ')}
- Places: ${data.places.join(', ')}
- Local Food: ${data.food.join(', ')}
- Shopping: ${data.shopping.join(', ')}
`;
};

export default destinationsData;
