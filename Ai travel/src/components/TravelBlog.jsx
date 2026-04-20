import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SAMPLE_POSTS = [
  { id:1, title:'Top 10 Hidden Gems in India 2025', category:'India', img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=220&fit=crop', excerpt:'Discover lesser-known destinations that most tourists miss — from Ziro Valley to Majuli Island...', readTime:'5 min', date:'Jan 2025', tags:['India','Hidden Gems','Budget'] },
  { id:2, title:'Complete Bali Guide for Indians', category:'International', img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=220&fit=crop', excerpt:'Everything you need to know — visa, currency, best areas, food, and how to save money...', readTime:'8 min', date:'Dec 2024', tags:['Bali','International','Guide'] },
  { id:3, title:'Budget Travel: Goa in ₹10,000', category:'Budget', img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=220&fit=crop', excerpt:'Yes, it\'s possible! Complete 5-day Goa trip under ₹10,000 including travel, stay and food...', readTime:'6 min', date:'Nov 2024', tags:['Goa','Budget','Tips'] },
  { id:4, title:'Solo Travel Safety Tips for India', category:'Tips', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=220&fit=crop', excerpt:'Essential safety tips, apps to use, emergency contacts, and how to stay safe while traveling solo...', readTime:'7 min', date:'Oct 2024', tags:['Solo','Safety','Tips'] },
  { id:5, title:'Best Hill Stations Near Mumbai', category:'India', img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=220&fit=crop', excerpt:'Weekend getaways from Mumbai — Lonavala, Mahabaleshwar, Matheran and more with travel details...', readTime:'4 min', date:'Sep 2024', tags:['Mumbai','Hill Stations','Weekend'] },
  { id:6, title:'Thailand vs Bali: Which is Better?', category:'International', img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=220&fit=crop', excerpt:'Detailed comparison of cost, visa, food, beaches, and overall experience for Indian travelers...', readTime:'9 min', date:'Aug 2024', tags:['Thailand','Bali','Comparison'] },
];

const CATEGORIES = ['All', 'India', 'International', 'Budget', 'Tips'];

const TravelBlog = () => {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [category, setCategory] = useState('All');
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [readPost, setReadPost] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);

  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category);

  const generatePost = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      let content = '';
      if (API_KEY) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const res = await model.generateContent(`Write a short travel blog post title and excerpt (2 sentences) about: "${topic}" for Indian travelers. Format: TITLE: [title]\nEXCERPT: [excerpt]\nTAGS: [3 tags comma separated]`);
        content = res.response.text();
      }
      const titleMatch = content.match(/TITLE:\s*(.+)/);
      const excerptMatch = content.match(/EXCERPT:\s*(.+)/);
      const tagsMatch = content.match(/TAGS:\s*(.+)/);
      const newPost = {
        id: Date.now(), title: titleMatch?.[1]?.trim() || topic,
        category: 'AI Generated', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=220&fit=crop',
        excerpt: excerptMatch?.[1]?.trim() || `Discover everything about ${topic} for Indian travelers.`,
        readTime: '5 min', date: 'Just now',
        tags: tagsMatch?.[1]?.split(',').map(t => t.trim()) || [topic, 'Travel', 'India']
      };
      setPosts(prev => [newPost, ...prev]);
      setTopic('');
    } catch {}
    finally { setGenerating(false); }
  };

  const openPost = async (post) => {
    setReadPost(post);
    setLoadingPost(true);
    setPostContent('');
    try {
      if (API_KEY) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const res = await model.generateContent(`Write a detailed travel blog post for Indians about: "${post.title}". Include practical tips, costs in INR, best time to visit, and personal recommendations. Use emojis and bullet points. Keep it under 400 words.`);
        setPostContent(res.response.text());
      } else {
        setPostContent(`# ${post.title}\n\n${post.excerpt}\n\n## Key Highlights\n• Best time to visit\n• Budget breakdown in ₹\n• Top attractions\n• Local food to try\n• Travel tips\n\nThis is a sample blog post. Add your Gemini API key for AI-generated content.`);
      }
    } catch { setPostContent(post.excerpt); }
    finally { setLoadingPost(false); }
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 6vw 60px' }}>
      <div className="section-label">Inspiration</div>
      <h2 className="section-title">Travel Blog ✍️</h2>
      <p className="section-sub">AI-powered travel articles — tips, guides & inspiration for Indian travelers</p>

      {/* AI Generate */}
      <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 16, padding: 20, marginBottom: 28 }}>
        <div style={{ color: '#f43f5e', fontWeight: 700, marginBottom: 10 }}>🤖 Generate AI Blog Post</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic: e.g. 'Budget trip to Ladakh'" onKeyDown={e => e.key === 'Enter' && generatePost()}
            style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem' }} />
          <button onClick={generatePost} disabled={generating || !topic}
            style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', opacity: generating ? 0.7 : 1 }}>
            {generating ? '⏳ Generating...' : '✨ Generate'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${category === c ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: category === c ? 'rgba(244,63,94,0.15)' : 'transparent', color: category === c ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {filtered.map(post => (
          <div key={post.id} onClick={() => openPost(post)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src={post.img} alt={post.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=220&fit=crop'; }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <span style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{post.category}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', alignSelf: 'center' }}>{post.readTime} read · {post.date}</span>
              </div>
              <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 10 }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {post.tags.map(t => <span key={t} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>#{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read Post Modal */}
      {readPost && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }} onClick={() => setReadPost(null)}>
          <div style={{ background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 20, maxWidth: 680, width: '100%', padding: 32, marginTop: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '0.78rem', padding: '3px 12px', borderRadius: 10, fontWeight: 700 }}>{readPost.category}</span>
              <button onClick={() => setReadPost(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>
            <img src={readPost.img} alt={readPost.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} />
            <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>{readPost.title}</h2>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: 20 }}>{readPost.readTime} read · {readPost.date}</div>
            {loadingPost ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.5)' }}>⏳ AI is writing the full article...</div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{postContent}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBlog;
