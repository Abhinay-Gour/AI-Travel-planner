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
  },
  rishikesh: {
    airport: "Jolly Grant Airport, Dehradun",
    hotels: ["Aloha on the Ganges", "Taj Rishikesh Resort & Spa", "Ananda in the Himalayas", "Glasshouse on the Ganges", "Hotel Surya Ganges"],
    restaurants: ["The Beatles Cafe", "Chotiwala Restaurant", "Little Buddha Cafe", "Oasis Restaurant", "Devraj Coffee Corner"],
    places: ["Laxman Jhula", "Ram Jhula", "Triveni Ghat", "Parmarth Niketan Ashram", "Beatles Ashram (Chaurasi Kutia)", "Neelkanth Mahadev Temple", "Rajaji National Park", "Neer Garh Waterfall", "Kunjapuri Devi Temple", "Ganga Aarti at Triveni Ghat"],
    food: ["Chole Puri from Chotiwala", "Thali at Devraj Coffee Corner", "Lassi", "Aloo Puri", "Banana Pancake from cafes"],
    shopping: ["Rudraksha beads from Laxman Jhula", "Yoga mats and accessories", "Ayurvedic herbs", "Spiritual books", "Handicrafts from Ram Jhula market"]
  },
  indore: {
    airport: "Devi Ahilya Bai Holkar Airport, Indore",
    hotels: ["Radisson Blu Hotel Indore", "Sayaji Hotel Indore", "Hotel Shreemaya", "Lemon Tree Hotel Indore", "Fortune Landmark Indore"],
    restaurants: ["Sarafa Bazaar Night Market", "Chhappan Dukan", "Vijay Chaat House", "Shree Dutt Kripa", "Hotel Shreemaya Restaurant"],
    places: ["Rajwada Palace", "Lal Bagh Palace", "Khajrana Ganesh Temple", "Sarafa Bazaar", "Chhappan Dukan", "Central Museum Indore", "Patalpani Waterfall", "Tincha Falls", "Omkareshwar", "Maheshwar Fort"],
    food: ["Poha Jalebi from Johny Hot Dog", "Bhutte ka Kees", "Garadu", "Dal Bafla", "Malpua", "Sabudana Khichdi"],
    shopping: ["Sarafa Bazaar for street food and jewelry", "Cloth Market", "Siyaganj Market", "MG Road", "Treasure Island Mall"]
  },
  hyderabad: {
    airport: "Rajiv Gandhi International Airport, Hyderabad",
    hotels: ["Taj Falaknuma Palace", "ITC Kohenur", "Novotel Hyderabad Convention Centre", "Park Hyatt Hyderabad", "Trident Hyderabad"],
    restaurants: ["Paradise Restaurant (Secunderabad)", "Bawarchi Restaurant", "Shah Ghouse Cafe", "Rayalaseema Ruchulu", "Chutneys Restaurant"],
    places: ["Charminar", "Golconda Fort", "Hussain Sagar Lake", "Salar Jung Museum", "Ramoji Film City", "Birla Mandir", "Mecca Masjid", "Qutb Shahi Tombs", "Laad Bazaar", "Nehru Zoological Park"],
    food: ["Hyderabadi Biryani from Paradise Restaurant", "Haleem from Shah Ghouse", "Double Ka Meetha", "Qubani ka Meetha", "Osmania Biscuits", "Irani Chai"],
    shopping: ["Laad Bazaar for bangles", "Begum Bazaar", "Shilparamam Craft Village", "Charminar surroundings", "GVK One Mall"]
  },
  kolkata: {
    airport: "Netaji Subhas Chandra Bose International Airport, Kolkata",
    hotels: ["The Oberoi Grand Kolkata", "ITC Royal Bengal", "Taj Bengal Kolkata", "Hyatt Regency Kolkata", "Peerless Inn"],
    restaurants: ["Peter Cat Restaurant", "Flurys on Park Street", "6 Ballygunge Place", "Bhojohori Manna", "Arsalan Restaurant"],
    places: ["Victoria Memorial", "Howrah Bridge", "Park Street", "Dakshineswar Kali Temple", "Kalighat Temple", "Indian Museum", "Marble Palace", "College Street", "New Market", "Eco Park", "Science City", "Kumartuli"],
    food: ["Kathi Roll from Nizam's", "Mishti Doi from Balaram Mullick", "Rosogolla from K.C. Das", "Biryani from Arsalan", "Kosha Mangsho", "Puchka"],
    shopping: ["New Market", "College Street for books", "Gariahat Market", "South City Mall", "Dakshinapan Shopping Centre"]
  },
  udaipur: {
    airport: "Maharana Pratap Airport, Udaipur",
    hotels: ["Taj Lake Palace", "Oberoi Udaivilas", "Leela Palace Udaipur", "Fateh Prakash Palace", "Hotel Jagat Niwas Palace"],
    restaurants: ["Upre by 1559 AD", "Ambrai Restaurant", "Jheel's Ginger Coffee Bar", "Natraj Dining Hall", "Millets of Mewar"],
    places: ["City Palace Udaipur", "Lake Pichola", "Jag Mandir Island", "Saheliyon-ki-Bari", "Fateh Sagar Lake", "Bagore Ki Haveli", "Shilpgram", "Sajjangarh Fort (Monsoon Palace)", "Jagdish Temple", "Vintage Car Museum"],
    food: ["Dal Baati Churma", "Laal Maas", "Daal Kachori", "Mawa Kachori", "Ghevar"],
    shopping: ["Hathi Pol Bazaar for miniature paintings", "Bada Bazaar", "Chetak Circle market", "Shilpgram crafts fair", "City Palace road shops"]
  },
  amritsar: {
    airport: "Sri Guru Ram Dass Jee International Airport, Amritsar",
    hotels: ["Taj Swarna Amritsar", "Hyatt Amritsar", "Hotel Ramada Amritsar", "Holiday Inn Amritsar", "Hotel Grace"],
    restaurants: ["Bharawan Da Dhaba", "Kesar Da Dhaba", "Brothers' Dhaba", "Beera Chicken House", "Crystal Restaurant"],
    places: ["Golden Temple (Harmandir Sahib)", "Jallianwala Bagh", "Wagah Border Ceremony", "Durgiana Temple", "Gobindgarh Fort", "Maharaja Ranjit Singh Museum", "Ram Bagh Garden", "Partition Museum"],
    food: ["Amritsari Kulcha from Bharawan Da Dhaba", "Langar at Golden Temple", "Makki di Roti Sarson da Saag", "Lassi from Gurdas Ram", "Pinni", "Amritsari Fish"],
    shopping: ["Hall Bazaar for phulkari", "Katra Jaimal Singh Market", "Lawrence Road", "Golden Temple complex shops", "Shastri Market"]
  },
  mysore: {
    airport: "Mysore Airport (Mandakalli Airport)",
    hotels: ["Lalitha Mahal Palace Hotel", "Radisson Blu Plaza Hotel Mysore", "Hotel Sandesh The Prince", "The Windflower Resort & Spa", "Hotel Roopa"],
    restaurants: ["Hotel RRR Restaurant", "Jewel Rock Restaurant", "Vinayaka Mylari", "Hotel Dasaprakash", "Om Shanthi Restaurant"],
    places: ["Mysore Palace", "Chamundeshwari Temple", "Brindavan Gardens", "Mysore Zoo", "St. Philomena's Church", "Jaganmohan Palace", "Karanji Lake", "Railway Museum", "Devaraja Market"],
    food: ["Mysore Pak from Guru Sweet Mart", "Mysore Masala Dosa", "Obbattu", "Chitranna", "Filter Coffee"],
    shopping: ["Devaraja Market for flowers and spices", "Mysore Silk at KSIC", "Cauvery Handicrafts Emporium", "Sayyaji Rao Road", "Chamundi Hill souvenirs"]
  },
  pune: {
    airport: "Pune Airport (Lohegaon Airport)",
    hotels: ["JW Marriott Pune", "The Westin Pune Koregaon Park", "Conrad Pune", "Hyatt Regency Pune", "Hotel Sunderban"],
    restaurants: ["Malaka Spice", "Cafe Goodluck", "Vaishali Restaurant", "Hotel Shreyas", "Dario's Restaurant"],
    places: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Dagdusheth Halwai Ganapati Temple", "Osho International Meditation Resort", "Pataleshwar Cave Temple", "Koregaon Park", "Saras Baug", "Raja Dinkar Kelkar Museum"],
    food: ["Misal Pav from Bedekar Tea Stall", "Bhakarwadi from Chitale Bandhu", "Puneri Dal", "Mastani from Sujata Mastani", "Sabudana Vada"],
    shopping: ["FC Road", "MG Road", "Laxmi Road", "Tulsi Baug", "Chinchwad market"]
  },
  leh: {
    airport: "Kushok Bakula Rimpochee Airport, Leh",
    hotels: ["The Grand Dragon Ladakh", "Stok Palace Heritage Hotel", "Nimmu House", "Hotel Ladakh Greens", "Chamba Camp Thiksey"],
    restaurants: ["Lamayuru Restaurant", "Bon Appetit Restaurant", "Gesmo Restaurant", "Tibetan Kitchen", "Cafe Jeevan"],
    places: ["Pangong Tso Lake", "Nubra Valley", "Magnetic Hill", "Shanti Stupa", "Leh Palace", "Thiksey Monastery", "Hemis Monastery", "Diskit Monastery", "Khardung La Pass", "Zanskar Valley", "Tso Moriri Lake"],
    food: ["Thukpa", "Momos from Tibetan Kitchen", "Tsampa", "Skyu", "Butter Tea", "Chhurpe (Yak Cheese)"],
    shopping: ["Leh Main Bazaar for Pashmina", "Tibetan artifacts from Changspa", "Prayer flags", "Turquoise jewelry", "Thangka paintings"]
  },
  coorg: {
    airport: "Mangalore International Airport",
    hotels: ["Taj Madikeri Resort & Spa", "The Tamara Coorg", "Evolve Back Coorg", "Orange County Resort", "Club Mahindra Madikeri"],
    restaurants: ["Raintree Restaurant", "Coorg Cuisine", "Hotel East End", "Dining at Evolve Back", "Honey Valley Estate"],
    places: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Namdroling Monastery (Golden Temple)", "Iruppu Falls", "Talacauvery", "Madikeri Fort", "Brahmagiri Peak", "Harangi Dam"],
    food: ["Pandi Curry (Pork Curry)", "Kadambuttu", "Noolputtu", "Coorg Biryani", "Bamboo Shoot Curry", "Coorg Coffee"],
    shopping: ["Coorg coffee from estates", "Honey from local farms", "Spices from Madikeri market", "Coorg sarees", "Bamboo crafts"]
  },
  ooty: {
    airport: "Coimbatore International Airport",
    hotels: ["Savoy Hotel Ooty by CGH", "Fortune Sullivan Court", "The Residency Towers", "Hotel Lakeview", "Gem Park Ooty"],
    restaurants: ["Sidewalk Cafe", "Hotel Dasaprakash Ooty", "The Chalet", "Garden Restaurant", "Willy's Coffee Pub"],
    places: ["Ooty Lake", "Botanical Gardens", "Doddabetta Peak", "Mudumalai National Park", "Rose Garden", "Thread Garden", "Emerald Lake", "Avalanche Lake", "Nilgiri Mountain Railway", "Pykara Lake"],
    food: ["Ooty Varkey", "Home-made chocolate from shops on Commercial Road", "Ooty Nilgiri tea", "Carrot Halwa", "Eucalyptus oil products"],
    shopping: ["Commercial Road for chocolates and oils", "Ooty Botanical Garden shop", "Nilgiri tea shops", "Government Emporium", "Local honey stalls"]
  },
  jodhpur: {
    airport: "Jodhpur Airport",
    hotels: ["Umaid Bhawan Palace", "Raas Jodhpur", "Taj Hari Mahal", "RAAS Devigarh", "Hotel Haveli Inn Pal"],
    restaurants: ["Indique Rooftop Restaurant", "Jhankar Choti Haveli", "Gypsy Restaurant", "Shri Mishrilal Hotel", "Omelette Shop Clock Tower"],
    places: ["Mehrangarh Fort", "Jaswant Thada", "Umaid Bhawan Palace Museum", "Clock Tower", "Sardar Market", "Rao Jodha Desert Rock Park", "Mandore Gardens", "Balsamand Lake", "Toorji Ka Jhalra (Stepwell)"],
    food: ["Mirchi Bada from Shri Mishrilal", "Mawa Kachori", "Dal Baati Churma", "Makhaniya Lassi", "Pyaaz Kachori"],
    shopping: ["Sardar Market at Clock Tower", "Nai Sarak for textiles", "Tripolia Bazaar", "Sojati Gate for handicrafts", "Khanda Falsa market"]
  },
  bangkok_phuket: {
    airport: "Phuket International Airport",
    hotels: ["Amanpuri Resort Phuket", "Trisara Phuket", "Rosewood Phuket", "Sri Panwa Phuket", "Mom Tri's Villa Royale"],
    restaurants: ["Suay Restaurant Phuket", "Samsara Phuket", "Seafood at Rawai Beach", "Roti Talay", "Blue Elephant Phuket"],
    places: ["Patong Beach", "Phi Phi Islands", "Phang Nga Bay", "Big Buddha Phuket", "Old Phuket Town", "Kata Beach", "Karon Beach", "Promthep Cape", "Tiger Kingdom", "Similan Islands"],
    food: ["Tom Kha Gai", "Green Curry", "Pad See Ew", "Grilled Seafood at Rawai", "Khao Pad", "Mango with Sticky Rice"],
    shopping: ["Patong Night Bazaar", "Jungceylon Mall", "Old Town shops", "Central Festival Phuket", "Naka Weekend Market"]
  },
  phuket: {
    airport: "Phuket International Airport",
    hotels: ["Amanpuri Resort Phuket", "Trisara Phuket", "Rosewood Phuket", "Sri Panwa Phuket", "Mom Tri's Villa Royale"],
    restaurants: ["Suay Restaurant Phuket", "Samsara Phuket", "Seafood at Rawai Beach", "Roti Talay", "Blue Elephant Phuket"],
    places: ["Patong Beach", "Phi Phi Islands", "Phang Nga Bay", "Big Buddha Phuket", "Old Phuket Town", "Kata Beach", "Karon Beach", "Promthep Cape", "Tiger Kingdom", "Similan Islands"],
    food: ["Tom Kha Gai", "Green Curry", "Pad See Ew", "Grilled Seafood at Rawai", "Khao Pad", "Mango with Sticky Rice"],
    shopping: ["Patong Night Bazaar", "Jungceylon Mall", "Old Town shops", "Central Festival Phuket", "Naka Weekend Market"]
  },
  amsterdam: {
    airport: "Amsterdam Airport Schiphol (AMS)",
    hotels: ["Hotel V Nesplein", "The Dylan Amsterdam", "Conservatorium Hotel", "Hotel TwentySeven", "INK Hotel Amsterdam"],
    restaurants: ["De Kas Restaurant", "Rijks Restaurant", "Moeders Restaurant", "The Seafood Bar", "Cafe de Jaren"],
    places: ["Anne Frank House", "Rijksmuseum", "Van Gogh Museum", "Vondelpark", "Canal Ring (Grachtengordel)", "Keukenhof Gardens", "Heineken Experience", "Royal Palace Amsterdam", "Jordaan Neighbourhood", "NEMO Science Museum"],
    food: ["Stroopwafel from Albert Cuyp Market", "Haring (Raw Herring)", "Dutch Pancakes from Pancakes Amsterdam", "Bitterballen", "Stamppot", "Jenever (Dutch Gin)"],
    shopping: ["Albert Cuyp Market", "P.C. Hooftstraat for luxury", "Waterlooplein Flea Market", "Nine Streets (De Negen Straatjes)", "Kalverstraat"]
  },
  prague: {
    airport: "Vaclav Havel Airport Prague (PRG)",
    hotels: ["Four Seasons Hotel Prague", "Hotel Josef Prague", "Augustine Prague", "Mandarin Oriental Prague", "Hotel Paris Prague"],
    restaurants: ["Cafe Savoy", "Lokál Restaurant", "La Degustation Boheme Bourgeoise", "V Zátiší Restaurant", "Eska Restaurant"],
    places: ["Prague Castle", "Charles Bridge", "Old Town Square", "Astronomical Clock", "Wenceslas Square", "Josefov (Jewish Quarter)", "Petrin Hill", "Vinohrady District", "Vysehrad", "Prague Zoo"],
    food: ["Svickova (Beef Sirloin)", "Goulash with Bread Dumplings", "Trdelnik from Old Town", "Czech Pilsner at U Fleku", "Bramborak", "Palacinka"],
    shopping: ["Parizska Street for luxury", "Palladium Shopping Centre", "Old Town souvenir shops", "Havels Market", "Nusle Market"]
  },
  sydney: {
    airport: "Sydney Kingsford Smith Airport (SYD)",
    hotels: ["Park Hyatt Sydney", "Shangri-La Sydney", "Four Seasons Hotel Sydney", "The Langham Sydney", "QT Sydney"],
    restaurants: ["Quay Restaurant", "Tetsuya's", "Rockpool Bar & Grill", "Ms. G's", "Icebergs Dining Room Bondi"],
    places: ["Sydney Opera House", "Sydney Harbour Bridge", "Bondi Beach", "The Rocks", "Darling Harbour", "Royal Botanic Garden", "Taronga Zoo", "Manly Beach", "Blue Mountains", "Luna Park Sydney"],
    food: ["Barramundi Fish & Chips", "Tim Tam biscuits", "Meat Pie", "Flat White Coffee", "Pavlova", "Vegemite Toast"],
    shopping: ["Queen Victoria Building (QVB)", "Westfield Sydney", "Paddington Markets", "The Rocks Markets", "Strand Arcade"]
  },
  cairo: {
    airport: "Cairo International Airport (CAI)",
    hotels: ["Four Seasons Hotel Cairo at Nile Plaza", "Marriott Mena House Cairo", "Sofitel Cairo Nile El Gezirah", "Kempinski Nile Hotel", "Conrad Cairo"],
    restaurants: ["Koshary Abou Tarek", "Sequoia Restaurant", "Naguib Mahfouz Cafe", "Farahat Restaurant", "La Bodega"],
    places: ["Pyramids of Giza", "Sphinx", "Egyptian Museum", "Khan el-Khalili Bazaar", "Citadel of Cairo", "Mohamed Ali Mosque", "Coptic Cairo", "Al-Azhar Mosque", "Luxor Temple (day trip)", "Valley of the Kings"],
    food: ["Koshari from Koshary Abou Tarek", "Ful Medames", "Ta'meya (Falafel)", "Hawawshi", "Basbousa", "Ahwa (Egyptian Coffee)"],
    shopping: ["Khan el-Khalili for spices and papyrus", "Tentmakers Bazaar", "Cairo Festival City Mall", "Wekalet el Balah", "City Stars Mall"]
  },
  newyork: {
    airport: "John F. Kennedy International Airport (JFK) / LaGuardia Airport (LGA)",
    hotels: ["The Plaza Hotel", "Four Seasons Hotel New York", "The Mandarin Oriental New York", "1 Hotel Central Park", "The Standard High Line"],
    restaurants: ["Le Bernardin", "Katz's Delicatessen", "Peter Luger Steak House", "Shake Shack Madison Square Park", "Grimaldi's Pizzeria Brooklyn"],
    places: ["Statue of Liberty & Ellis Island", "Central Park", "Empire State Building", "Metropolitan Museum of Art", "Times Square", "Brooklyn Bridge", "The High Line", "9/11 Memorial & Museum", "One World Observatory", "Rockefeller Center", "Grand Central Terminal", "MOMA"],
    food: ["New York Bagel from Ess-a-Bagel", "Pizza from Di Fara Pizza Brooklyn", "Pastrami from Katz's Deli", "Cheesecake from Junior's", "Hot Dog from Gray's Papaya"],
    shopping: ["Fifth Avenue", "SoHo boutiques", "Chelsea Market", "Macy's Herald Square", "Brooklyn Flea Market"]
  },
  milan: {
    airport: "Milan Malpensa Airport (MXP)",
    hotels: ["Four Seasons Hotel Milano", "Armani Hotel Milano", "Bulgari Hotel Milano", "Park Hyatt Milano", "Hotel Principe di Savoia"],
    restaurants: ["Osteria Francescana (Modena)", "Il Luogo di Aimo e Nadia", "Trattoria da Pino", "Ristorante Berton", "Navigli Canal restaurants"],
    places: ["Duomo di Milano", "Galleria Vittorio Emanuele II", "Brera Art Gallery", "Sforza Castle", "Santa Maria delle Grazie (The Last Supper)", "Navigli Canals", "Quadrilatero della Moda", "Parco Sempione", "La Scala Opera House"],
    food: ["Risotto alla Milanese", "Ossobuco", "Cotoletta alla Milanese", "Panettone", "Aperol Spritz at Navigli", "Gelato from Grom"],
    shopping: ["Quadrilatero della Moda (Via Montenapoleone)", "Galleria Vittorio Emanuele II", "Corso Buenos Aires", "Rinascente department store", "Navigli antique market"]
  },
  vienna: {
    airport: "Vienna International Airport (VIE)",
    hotels: ["Hotel Sacher Wien", "The Ritz-Carlton Vienna", "Hotel Imperial Vienna", "Palais Coburg", "Motel One Wien-Staatsoper"],
    restaurants: ["Figlmuller Wollzeile", "Cafe Central", "Steirereck im Stadtpark", "Zum Wohl", "Cafe Hawelka"],
    places: ["Schonbrunn Palace", "Belvedere Palace", "St. Stephen's Cathedral", "Hofburg Palace", "Vienna State Opera", "Prater & Giant Ferris Wheel", "Kunsthistorisches Museum", "Naschmarkt", "Ringstrasse", "Vienna Woods"],
    food: ["Wiener Schnitzel from Figlmuller", "Apple Strudel from Cafe Central", "Sachertorte from Hotel Sacher", "Tafelspitz", "Kaiserschmarrn", "Viennese Coffee"],
    shopping: ["Naschmarkt for food", "Mariahilfer Strasse", "Graben Street", "Dorotheum Auction House", "Wienzeile Flea Market"]
  },
  zurich: {
    airport: "Zurich Airport (ZRH)",
    hotels: ["The Dolder Grand", "Baur au Lac", "Park Hyatt Zurich", "Hotel Widder", "25hours Hotel Langstrasse"],
    restaurants: ["Kronenhalle Restaurant", "Haus Hiltl (oldest vegetarian)", "Zeughauskeller", "Clouds Restaurant", "Frau Gerolds Garten"],
    places: ["Lake Zurich", "Zurich Old Town (Altstadt)", "Grossmunster Cathedral", "Swiss National Museum", "Bahnhofstrasse", "Uetliberg Mountain", "Rhine Falls (Schaffhausen)", "Zurich Zoo", "Fraumunster Church"],
    food: ["Zurchergeschnetzeltes", "Raclette", "Swiss Fondue", "Rosti", "Luxemburgerli from Sprungli", "Swiss Chocolate from Lindt Home of Chocolate"],
    shopping: ["Bahnhofstrasse for luxury", "Niederdorf for boutiques", "Langstrasse", "Zurich HB shops", "Flohmarkt Buerkliplatz flea market"]
  },
  kualalumpur: {
    airport: "Kuala Lumpur International Airport (KLIA)",
    hotels: ["Mandarin Oriental Kuala Lumpur", "The Ritz-Carlton KL", "Traders Hotel KL", "Aloft Kuala Lumpur Sentral", "Hotel Stripes KL"],
    restaurants: ["Jalan Alor Food Street", "Atmosphere 360 at KL Tower", "Hawker Chan KL", "Nasi Kandar Pelita", "Din Tai Fung Pavilion"],
    places: ["Petronas Twin Towers", "Batu Caves", "KLCC Park", "KL Tower", "Bukit Bintang", "Central Market KL", "Petaling Street (Chinatown)", "Islamic Arts Museum", "Lake Gardens (Perdana Botanical Garden)", "Aquaria KLCC"],
    food: ["Nasi Lemak", "Char Kway Teow", "Roti Canai", "Laksa", "Satay Kajang", "Cendol from Jalan Alor"],
    shopping: ["Pavilion KL", "KLCC Suria Mall", "Bukit Bintang Plaza", "Central Market for handicrafts", "Petaling Street for bargains"]
  },
  seoul: {
    airport: "Incheon International Airport (ICN), Seoul",
    hotels: ["The Shilla Seoul", "Lotte Hotel Seoul", "Four Seasons Hotel Seoul", "Grand Hyatt Seoul", "Signiel Seoul"],
    restaurants: ["Mingles Restaurant", "Gwangjang Market", "Tosokchon Samgyetang", "Myeongdong Kyoja", "Jungsik Seoul"],
    places: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Myeongdong", "Insadong", "Namsan Tower (N Seoul Tower)", "Dongdaemun Design Plaza", "Hongdae", "Lotte World", "DMZ Tour", "Noryangjin Fish Market", "Cheonggyecheon Stream"],
    food: ["Korean BBQ at Maple Tree House", "Bibimbap at Gogung", "Samgyetang from Tosokchon", "Tteokbokki from Gwangjang", "Kimchi", "Japchae"],
    shopping: ["Myeongdong for cosmetics", "Dongdaemun for fashion", "Insadong for antiques", "COEX Mall", "Namdaemun Market"]
  },
  beijing: {
    airport: "Beijing Capital International Airport (PEK)",
    hotels: ["The Peninsula Beijing", "China World Hotel Beijing", "Rosewood Beijing", "The Opposite House", "Park Hyatt Beijing"],
    restaurants: ["Quanjude Peking Duck Restaurant", "Da Dong Roast Duck", "Hua Jia Yi Yuan", "Made in China at Grand Hyatt", "Wangfujing Snack Street"],
    places: ["Great Wall of China (Mutianyu Section)", "Forbidden City", "Tiananmen Square", "Temple of Heaven", "Summer Palace", "Lama Temple", "Old Summer Palace", "Wangfujing Street", "Hutong Neighborhoods", "Beijing National Stadium (Bird's Nest)"],
    food: ["Peking Duck from Quanjude", "Jianbing (Crepe)", "Zhajiangmian noodles", "Dumplings from Din Tai Fung Beijing", "Tanghulu", "Hot Pot"],
    shopping: ["Wangfujing Street", "Silk Market (Xiushui)", "Panjiayuan Antique Market", "Sanlitun Village", "798 Art District"]
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
