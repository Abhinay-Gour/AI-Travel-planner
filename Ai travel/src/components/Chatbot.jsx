import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const STORAGE_KEY = 'ai_travel_chat_history';

const QUICK_REPLIES = [
  '🗺️ Best places in India?',
  '💰 Budget trip ideas',
  '🏖️ Beach destinations',
  '🏔️ Hill stations',
  '✈️ Indore se Goa kaise jaaye?',
  '🚆 Train vs Flight vs Bus comparison',
];

const INITIAL_MSG = {
  id: 1,
  role: 'bot',
  text: "Hi! I'm your AI Travel Assistant ✈️\n\nAsk me anything about travel — destinations, budgets, visa info, packing tips, or let me plan your perfect trip!",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [INITIAL_MSG];
    } catch { return [INITIAL_MSG]; }
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

  const clearChat = () => {
    setMessages([INITIAL_MSG]);
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

        const prompt = `You are an expert AI travel assistant for an Indian travel planning website called "AI Travel Planner".

Rules:
- Answer in the SAME language the user writes in (Hindi mein puche to Hindi mein jawab do, English mein puche to English mein)
- You remember the full conversation context — answer follow-up questions accordingly
- For transport questions (flight/train/bus): always give ALL 3 options with cost in INR, duration, and pros/cons
- For destinations: mention best time, budget breakdown, must-see places, local food, stay options
- For international: mention visa info for Indians, flight cost from India
- Use emojis and bullet points for clarity
- Keep answers detailed but structured (max 8-10 lines)
- If user asks about booking flights/hotels, mention they can use the Transport and Hotels pages on this site

Conversation so far:
${history}

Now answer the latest message. Give a complete, helpful response:`;

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
    const lower = q.toLowerCase();
    if (lower.includes('goa')) {
      if (lower.includes('indore') || lower.includes('flight') || lower.includes('train') || lower.includes('bus') || lower.includes('kaise')) {
        return '✈️ Indore se Goa — Teen Options:\n\n🛫 Flight: ₹3,000-8,000 (1.5 hrs, IndiGo/SpiceJet, Indore→Goa direct)\n\n🚆 Train: ₹800-2,500 (Indore→Madgaon, ~20 hrs, Avantika/Rajdhani)\n\n🚌 Bus: ₹600-1,200 (Indore→Panaji, ~18 hrs, Volvo sleeper)\n\n💡 Best value: Train (sleeper AC). Best time: Oct-March. Goa budget: ₹15,000-25,000 for 5 days.';
      }
      return '🏖️ Goa is perfect Oct-March! Budget: ₹15,000-25,000 for 5 days. North Goa for parties, South Goa for peace. Must-visit: Baga Beach, Dudhsagar Falls, Old Goa churches.';
    }
    if (lower.includes('train') || lower.includes('flight') || lower.includes('bus') || lower.includes('transport')) {
      return '🚆 Transport Options (India):\n\n✈️ Flight: Fastest, ₹2,000-10,000, book 2-3 weeks early\n🚆 Train: Best value, ₹500-3,000, AC/Sleeper options, book on IRCTC\n🚌 Bus: Cheapest, ₹300-1,500, Volvo sleeper for overnight\n\nKaunsi jagah jaana hai? Main aapko exact options bata sakta hoon!';
    }
    if (lower.includes('manali') || lower.includes('himachal')) return '🏔️ Manali is best May-June & Oct-Nov. Budget: ₹20,000-35,000 for 7 days. Must-do: Rohtang Pass, Solang Valley, Old Manali market. Book hotels in advance!';
    if (lower.includes('budget')) return '💸 Top budget destinations from India: Rishikesh (₹8k/5days), Pondicherry (₹10k/4days), Hampi (₹7k/3days), Varanasi (₹8k/4days). All include stay, food & local transport!';
    if (lower.includes('beach')) return '🏖️ Best beaches: Goa (party vibes), Andaman (crystal water, ₹30k/5days), Varkala Kerala (cliffs & yoga), Pondicherry (French charm). Andaman is the most scenic!';
    if (lower.includes('visa')) return '🌍 Visa-free for Indians: Nepal, Bhutan, Maldives, Mauritius, Indonesia (30 days), Thailand (visa on arrival), Sri Lanka (e-visa free). Southeast Asia is easiest for Indians!';
    if (lower.includes('indore')) return '🏛️ Indore highlights: Rajwada Palace, 56 Dukan (poha, jalebi, garadu), Sarafa Bazaar (night food market), Lal Bagh Palace, Kanch Mandir, Patalpani Waterfall. Best food city in India!';
    if (lower.includes('pack') || lower.includes('packing')) return '🎒 Essentials: Comfortable walking shoes, weather-appropriate clothes, power bank, travel adapter, copies of documents, basic medicines, reusable water bottle, and a good camera!';
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('ruk')) return '🏨 Stay Options:\n\n⭐ Budget: Hostels/Guesthouses ₹500-1,500/night\n⭐⭐ Mid-range: 3-star hotels ₹1,500-4,000/night\n⭐⭐⭐ Luxury: 5-star ₹8,000+/night\n\nBooking.com, MakeMyTrip, OYO best platforms hain. Destination batao, specific recommendations dunga!';
    return '✈️ Main aapki help kar sakta hoon! Destination, budget, aur travel dates batao — personalized trip plan bana dunga. Ya koi bhi travel question pucho!';
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
