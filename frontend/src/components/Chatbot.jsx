import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const STORAGE_KEY = 'ai_travel_chat_history';

const QUICK_REPLIES = [
  '🗺️ Best places in India?',
  '💰 Budget trip under ₹10,000?',
  '🏖️ Best beach destinations?',
  '🏔️ Best hill stations?',
  '🌍 Visa-free countries for Indians?',
  '🎒 Packing tips for mountains?',
  '🍜 Best food destinations India?',
  '❄️ Best winter destinations?',
  '🌸 Best honeymoon destinations?',
  '🚆 Train vs Flight vs Bus?',
];

const INITIAL_MSG_EN = {
  id: 1,
  role: 'bot',
  text: "Hi! I'm your AI Travel Assistant ✈️\n\nAsk me anything about travel — destinations, budgets, visa info, packing tips, or let me plan your perfect trip!",
};

const INITIAL_MSG_HI = {
  id: 1,
  role: 'bot',
  text: "Namaste! Main aapka AI Travel Assistant hoon ✈️\n\nKuch bhi poochho — destinations, budget, visa, packing tips, ya trip plan karwana ho — main hoon na!",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('chat_lang') || 'en');
  const INITIAL_MSG = lang === 'hi' ? INITIAL_MSG_HI : INITIAL_MSG_EN;
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [lang === 'hi' ? INITIAL_MSG_HI : INITIAL_MSG_EN];
    } catch { return [lang === 'hi' ? INITIAL_MSG_HI : INITIAL_MSG_EN]; }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Save chat history to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    localStorage.setItem('chat_lang', newLang);
    const initMsg = newLang === 'hi' ? INITIAL_MSG_HI : INITIAL_MSG_EN;
    setMessages([initMsg]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearChat = () => {
    const initMsg = lang === 'hi' ? INITIAL_MSG_HI : INITIAL_MSG_EN;
    setMessages([initMsg]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const copyMessage = (msg) => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareOnWhatsApp = (text) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported in this browser.'); return; }
    if (isListening) { recognitionRef.current?.stop(); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setInput('');
    const updatedMessages = [...messages, { id: Date.now(), role: 'user', text: userText }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      let botReply = '';

      if (API_KEY) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const history = updatedMessages
          .slice(1)
          .slice(-10)
          .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
          .join('\n');

        const isHindi = lang === 'hi';
        const prompt = `You are TravelGPT — a world-class AI travel expert for Indians, built into the AI Travel Planner website.

YOUR EXPERTISE:
1. DESTINATIONS — India & worldwide: best places, hidden gems, honeymoon, solo, family, adventure, pilgrimage
2. TRANSPORT — Flights (IndiGo, Air India, SpiceJet), Trains (IRCTC, Rajdhani, Vande Bharat), Buses (Volvo sleeper), Road trips
3. BUDGET PLANNING — Exact INR cost breakdowns: stay, food, transport, activities for any destination
4. HOTELS & STAY — Hostels, homestays, heritage hotels, houseboats, campsites, luxury resorts
5. FOOD — Local dishes, best restaurants, street food at every destination
6. VISA & DOCUMENTS — Visa requirements for Indians to every country, e-visa, visa on arrival
7. PACKING — Season & destination specific packing lists (mountains, beach, international, pilgrimage)
8. WEATHER — Best time to visit every destination, monsoon tips, peak vs offseason
9. SAFETY — Travel safety, emergency numbers, insurance, solo female travel tips
10. ITINERARY — Day-by-day plans for any destination, duration, budget
11. ADVENTURE — Trekking, camping, scuba, paragliding, rafting, skiing locations
12. PILGRIMAGE — Char Dham, Vaishno Devi, Tirupati, Shirdi, Golden Temple, all major religious sites
13. HONEYMOON — Romantic destinations, best resorts, couple activities
14. INTERNATIONAL — Southeast Asia, Europe, Middle East, USA — full guidance for Indians

KEY KNOWLEDGE:
- Budget gems: Rishikesh (8k/5d), Hampi (7k/3d), Varanasi (8k/4d), Pondicherry (10k/4d), Mcleod Ganj (9k/5d)
- Hill stations: Manali, Shimla, Darjeeling, Ooty, Munnar, Coorg, Mussoorie, Kasol, Spiti
- Beaches: Goa, Andaman, Varkala, Gokarna, Puri, Diu, Pondicherry
- Adventure: Rishikesh (rafting), Manali (skiing), Leh (bikes), Andaman (scuba), Bir Billing (paragliding)
- Honeymoon: Kashmir, Andaman, Maldives, Bali, Kerala, Udaipur
- Visa-free for Indians: Nepal, Bhutan, Maldives, Mauritius
- Visa on arrival: Thailand, Indonesia, Sri Lanka, Cambodia
- Easy e-visa: Dubai, Malaysia, Vietnam, Turkey, Kenya

RULES:
- ${isHindi ? 'ALWAYS reply in Hindi (Devanagari script). Use simple conversational Hindi.' : 'ALWAYS reply in English only.'}
- NEVER say I don't know — always give best answer
- ONLY answer travel-related questions
- Always give SPECIFIC real names — hotels, restaurants, places — never generic
- For transport: show all options (flight/train/bus) with INR price
- For budget: give per-day breakdown
- For international: always mention visa status for Indian passport
- Use emojis + bullet points, max 10-12 lines, concise but complete

Conversation so far:
${history}

User: ${userText}

Answer:`;

        const result = await model.generateContent(prompt);
        botReply = result.response.text();
      } else {
        botReply = getFallbackReply(userText);
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: botReply }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: getFallbackReply(userText)
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getFallbackReply = (q) => {
    const l = q.toLowerCase();
    if (l.includes('visa')) return '🌍 Visa Info for Indians:\n\n✅ Visa-Free: Nepal, Bhutan, Maldives, Mauritius, Jamaica\n✅ Visa on Arrival: Thailand (30d), Indonesia (30d), Cambodia, Myanmar, Laos\n✅ Easy e-Visa: Dubai, Malaysia, Vietnam, Turkey, Kenya, Sri Lanka\n📄 Schengen (Europe): Embassy apply, 2-3 weeks, bank statement needed';
    if (l.includes('honeymoon') || l.includes('couple') || l.includes('romantic')) return '🌸 Top Honeymoon Destinations:\n\n🌊 Andaman — ₹35k/couple, 5 days, crystal beaches\n❄️ Kashmir — ₹40k/couple, 6 days, Dal Lake & snow\n💧 Kerala — ₹30k/couple, 5 days, houseboat & backwaters\n🏝️ Maldives — ₹1.2L/couple, 4 days, overwater villa\n🌴 Bali — ₹70k/couple, 6 days, temples & terraces\n🏰 Udaipur — ₹25k/couple, 4 days, Lake Palace';
    if (l.includes('pack') || l.includes('packing')) return '🎒 Packing by Destination:\n\n🏔️ Mountains: Thermal wear, windproof jacket, trek shoes, SPF50+, lip balm, ORS\n🏖️ Beach: Light clothes, flip flops, sunscreen, swimwear, insect repellent\n🌍 International: Passport+copies, travel insurance, universal adapter, local currency\n🛕 Pilgrimage: Modest clothes, comfy footwear, identity proof';
    if (l.includes('budget') || l.includes('cheap') || l.includes('sasta')) return '💰 Budget Trips under ₹10,000:\n\n🔵 Rishikesh — ₹8k/5d (rafting+yoga+ghats)\n🔵 Hampi — ₹7k/3d (ruins+boulders+culture)\n🔵 Mcleod Ganj — ₹9k/5d (mountains+monastery)\n🔵 Varanasi — ₹8k/4d (ghats+temple+boat)\n🔵 Pondicherry — ₹10k/4d (French quarter+beach)\nIncludes: hostel + local food + local transport';
    if (l.includes('beach')) return '🏖️ Best Beach Destinations:\n\n🇮🇳 Andaman — Radhanagar Beach, best Oct-May, ₹25k/5d\n🌴 Goa — Baga, Palolem, Anjuna, best Nov-Feb, ₹15k/5d\n🏄 Varkala Kerala — cliff beach, yoga, best Oct-Mar, ₹12k/4d\n🌊 Gokarna — peaceful, hippie vibes, ₹8k/4d\n🌅 Pondicherry — French charm+beach, ₹10k/4d';
    if (l.includes('hill') || l.includes('mountain') || l.includes('snow')) return '🏔️ Best Hill Stations:\n\n❄️ Manali — Rohtang Pass, best May-Jun & Dec-Jan, ₹20k/6d\n🌿 Shimla — Mall Road, colonial charm, best Mar-Jun, ₹15k/5d\n🌟 Darjeeling — tea gardens, toy train, best Mar-May, ₹18k/5d\n🌸 Ooty — Nilgiri hills, botanical garden, best Apr-Jun, ₹12k/4d\n🗻 Spiti — offbeat monasteries, best Jun-Sep, ₹25k/7d\n✨ Kasol — backpacker paradise, best Mar-Jun, ₹9k/5d';
    if (l.includes('winter') || l.includes('december') || l.includes('january')) return '❄️ Best Winter Destinations (Dec-Feb):\n\n🏰 Rajasthan — Jaipur, Jodhpur, Udaipur, perfect weather, ₹18k/6d\n🌴 Goa — peak season, parties & beaches, ₹18k/5d\n🌿 Kerala — backwaters, Munnar, Kovalam, ₹20k/6d\n🐊 Andaman — best diving time, ₹28k/5d\n❄️ Manali/Kashmir — snowfall & skiing, ₹25k/6d';
    if (l.includes('goa')) return '🏖️ Goa Guide:\n\n📍 Beaches: Baga, Calangute, Anjuna, Palolem, Vagator\n🏨 Stay: The Leela, Aloft North Goa, Hotel Baga Marina\n🍽️ Food: Fishermans Wharf, Brittos Beach Shack, Martins Corner\n🛕 Visit: Dudhsagar Falls, Old Goa Churches, Chapora Fort\n⏰ Best Time: Nov-Feb | 💰 Budget: ₹15k-25k/5d\n🚆 From Indore: Flight ₹3-7k | Train ₹800-2.5k | Bus ₹600-1.2k';
    if (l.includes('kashmir') || l.includes('srinagar')) return '❄️ Kashmir Guide:\n\n📍 Places: Dal Lake, Gulmarg, Pahalgam, Sonamarg, Betaab Valley\n🏨 Stay: The Lalit Grand Palace, Houseboat on Dal Lake, Vivanta Dal View\n🍽️ Food: Ahdoos Restaurant — Rogan Josh, Wazwan, Kashmiri Kahwa\n⏰ Best Time: Apr-Jun (flowers) | Dec-Jan (snow)\n💰 Budget: ₹22k-35k/6d | 🛍️ Buy: Pashmina, Saffron, Dry Fruits';
    if (l.includes('manali')) return '🏔️ Manali Guide:\n\n📍 Places: Rohtang Pass, Solang Valley, Hadimba Temple, Old Manali, Beas River\n🏨 Stay: Span Resort & Spa, The Himalayan, Apple Country Resort\n🍽️ Food: Johnsons Cafe, Cafe 1947, Chopsticks Restaurant\n⏰ Best Time: May-Jun (adventure) | Dec-Jan (snow)\n💰 Budget: ₹18k-30k/6d | 🎿 Activities: Skiing, Paragliding, Rafting';
    if (l.includes('leh') || l.includes('ladakh')) return '🏔️ Leh-Ladakh Guide:\n\n📍 Places: Pangong Tso, Nubra Valley, Khardung La, Thiksey Monastery, Magnetic Hill\n🏨 Stay: The Grand Dragon Ladakh, Nimmu House, Stok Palace\n🍽️ Food: Tibetan Kitchen — Thukpa, Momos, Butter Tea\n⏰ Best Time: June-September only\n💰 Budget: ₹30k-50k/7d\n⚠️ Tip: Acclimatize 2 days, carry altitude medicine';
    if (l.includes('train') || l.includes('flight') || l.includes('bus') || l.includes('transport')) return '🚆 Transport Options:\n\n✈️ Flight: Fastest, ₹2k-10k, book 2-3 weeks early on MakeMyTrip/Ixigo\n🚆 Train: Best value, ₹500-3k, book on IRCTC 60 days early\n🚌 Bus: Cheapest, ₹300-1.5k, Volvo sleeper for overnight\n🚗 Cab: Best for hills/remote, ₹2k-8k/day\n\nKaunsi city se kaunsi city? Exact options bata dunga!';
    if (l.includes('pilgrimage') || l.includes('temple') || l.includes('mandir') || l.includes('tirth')) return '🛕 Top Pilgrimage Destinations:\n\n🙏 Varanasi — Kashi Vishwanath, Ganga Aarti\n🙏 Tirupati — Balaji Temple, darshan booking mandatory\n🙏 Vaishno Devi — Katra, 14km trek\n🙏 Shirdi — Sai Baba, 6hr from Mumbai\n🙏 Golden Temple — Amritsar, free langar 24/7\n🙏 Char Dham — Badrinath, Kedarnath, Gangotri, Yamunotri (May-Oct)';
    if (l.includes('international') || l.includes('abroad') || l.includes('foreign')) return '🌍 Best International Trips for Indians:\n\n🇮🇩 Bali — Visa on arrival, ₹60-80k/couple, 6d\n🇹🇭 Thailand — Visa on arrival, ₹60-90k/couple, 7d\n🇸🇬 Singapore — e-Visa, ₹1L+/couple, 5d\n🇦🇪 Dubai — e-Visa ₹3k, ₹1.2L+/couple, 5d\n🇲🇻 Maldives — Visa free, ₹1.5L+/couple, 4d\n🇯🇵 Japan — Visa required, ₹1.5L/person, 7d';
    if (l.includes('food') || l.includes('khana') || l.includes('eat')) return '🍜 Best Food Destinations India:\n\n🥘 Indore — Sarafa Bazaar, 56 Dukan, poha-jalebi, garadu\n🍖 Lucknow — Tunday Kababi, Idris Biryani, basket chaat\n🍛 Hyderabad — Paradise Biryani, Shah Ghouse Haleem\n🦀 Mumbai — Trishna (seafood), Khyber, Vada Pav\n🥗 Delhi — Karims, Paranthe Wali Gali, Chole Bhature\n🍮 Kolkata — Kathi Roll, Mishti Doi, Rosogolla';
    return '✈️ Main aapka travel expert hoon! Poochho kuch bhi:\n\n📍 Destination suggestions\n💰 Budget planning\n🚆 Transport options\n🏨 Hotel recommendations\n🍜 Local food guide\n🌍 Visa information\n🎒 Packing lists\n\nDestination batao — poora plan bata dunga!';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setIsOpen(o => !o)} aria-label="Chat">
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="fab-badge">AI</span>}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-header-info">
              <div className="chat-header-name">AI Travel Assistant</div>
              <div className="chat-header-status">Online — Ready to help</div>
            </div>
            <button className="chat-lang-btn" onClick={toggleLang} title="Toggle language">{lang === 'en' ? '🇮🇳 HI' : '🇬🇧 EN'}</button>
            <button className="chat-clear" onClick={clearChat} title="Clear chat">🗑️</button>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div className="msg-avatar">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                <div className="msg-bubble-wrap">
                  <div className="msg-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                  <div className="msg-actions">
                    <button className="msg-action-btn" onClick={() => copyMessage(msg)} title="Copy">
                      {copiedId === msg.id ? '✅' : '📋'}
                    </button>
                    {msg.role === 'bot' && (
                      <button className="msg-action-btn" onClick={() => shareOnWhatsApp(msg.text)} title="Share on WhatsApp">📤</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <div className="msg-avatar">🤖</div>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="quick-replies">
              {QUICK_REPLIES.map(q => (
                <button key={q} className="quick-reply" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <button
              className={`chat-voice-btn ${isListening ? 'listening' : ''}`}
              onClick={startVoiceInput}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isListening ? 'Listening...' : 'Ask about any destination...'}
            />
            <button className="chat-send" onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
