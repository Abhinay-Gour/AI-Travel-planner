import React, { useState } from 'react';

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(() => !!localStorage.getItem('feedback_submitted'));

  const submit = () => {
    if (!rating) return;
    localStorage.setItem('feedback_submitted', '1');
    localStorage.setItem('feedback_data', JSON.stringify({ rating, feedback, date: new Date().toISOString() }));
    setSubmitted(true);
    setTimeout(() => setOpen(false), 2000);
  };

  if (submitted && !open) return null;

  return (
    <>
      <button onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: 100, right: 80, zIndex: 996, background: 'rgba(15,10,11,0.9)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: 20, padding: '8px 14px', color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)' }}>
        ⭐ Rate Us
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: 150, right: 20, zIndex: 9996, background: '#1f1014', border: '1px solid rgba(225,29,72,0.25)', borderRadius: 20, padding: 24, width: 280, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', animation: 'toastIn 0.3s ease' }}>
          <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
              <div style={{ color: 'white', fontWeight: 700 }}>Thank you!</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 4 }}>Your feedback means a lot to us.</div>
            </div>
          ) : (
            <>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>How's your experience? 😊</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: 16 }}>Rate AI Travel Planner</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                    style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', transition: 'transform 0.15s', transform: (hover || rating) >= n ? 'scale(1.2)' : 'scale(1)', filter: (hover || rating) >= n ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                    ⭐
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Any suggestions? (optional)" rows={2}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.82rem', resize: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              )}
              <button onClick={submit} disabled={!rating}
                style={{ width: '100%', padding: '10px', background: rating ? 'linear-gradient(135deg,#f43f5e,#9f1239)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, color: rating ? 'white' : 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.88rem', cursor: rating ? 'pointer' : 'not-allowed' }}>
                Submit Feedback
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
