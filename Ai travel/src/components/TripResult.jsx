import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import PackingList from './PackingList';
import WeatherWidget from './WeatherWidget';
import { TripShareLink } from './TravelExtras';
import { useToast } from '../context/ToastContext';
import { getWhatsAppLink } from '../services/autoSendService';
import './TripResult.css';

const DEST_IMAGES = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=400&fit=crop',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=400&fit=crop',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=400&fit=crop',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=400&fit=crop',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=400&fit=crop',
  barcelona: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=400&fit=crop',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop',
  cairo: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=400&fit=crop',
  newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop',
  indore: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=400&fit=crop',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=800&h=400&fit=crop',
  andaman: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=400&fit=crop',
  rishikesh: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
  shimla: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=400&fit=crop',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=400&fit=crop',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
};

const REAL_PLACES = {
  indore: [
    { name: 'Rajwada Palace', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', desc: '200-year-old historical palace in the heart of Indore', type: 'Historical' },
    { name: '56 Dukan', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop', desc: 'Famous food street — try poha, jalebi, garadu & more', type: 'Food' },
    { name: 'Sarafa Bazaar', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop', desc: 'Night food market — best street food after 10 PM', type: 'Food' },
    { name: 'Lal Bagh Palace', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', desc: 'Magnificent palace with European architecture', type: 'Historical' },
    { name: 'Kanch Mandir', img: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=250&fit=crop', desc: 'Jain temple entirely decorated with mirrors & glass', type: 'Spiritual' },
    { name: 'Patalpani Waterfall', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', desc: '300-ft waterfall near Indore — perfect day trip', type: 'Nature' },
  ],
  goa: [
    { name: 'Baga Beach', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', desc: 'Most popular beach with water sports & nightlife', type: 'Beach' },
    { name: 'Dudhsagar Falls', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', desc: 'Spectacular 4-tiered waterfall on Goa-Karnataka border', type: 'Nature' },
    { name: 'Old Goa Churches', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop', desc: 'UNESCO World Heritage Portuguese churches', type: 'Historical' },
    { name: 'Anjuna Flea Market', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop', desc: 'Famous Wednesday market for clothes, jewelry & food', type: 'Shopping' },
  ],
  paris: [
    { name: 'Eiffel Tower', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=250&fit=crop', desc: 'Iconic iron lattice tower — symbol of Paris', type: 'Landmark' },
    { name: 'Louvre Museum', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=250&fit=crop', desc: "World's largest art museum — home of Mona Lisa", type: 'Museum' },
    { name: 'Montmartre', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop', desc: 'Artistic hilltop with Sacré-Cœur Basilica', type: 'Culture' },
    { name: 'Champs-Élysées', img: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=250&fit=crop', desc: 'Famous avenue for shopping, cafes & Arc de Triomphe', type: 'Shopping' },
  ],
  tokyo: [
    { name: 'Senso-ji Temple', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop', desc: 'Ancient Buddhist temple in Asakusa district', type: 'Spiritual' },
    { name: 'Shibuya Crossing', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', desc: "World's busiest pedestrian crossing", type: 'Landmark' },
    { name: 'Tsukiji Market', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop', desc: 'Fresh seafood & street food paradise', type: 'Food' },
    { name: 'Tokyo Skytree', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', desc: 'Tallest structure in Japan with panoramic views', type: 'Landmark' },
  ],
  bali: [
    { name: 'Tanah Lot Temple', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop', desc: 'Iconic sea temple on a rocky outcrop', type: 'Spiritual' },
    { name: 'Ubud Rice Terraces', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=250&fit=crop', desc: 'UNESCO-listed Tegallalang rice terraces', type: 'Nature' },
    { name: 'Kuta Beach', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', desc: 'Famous beach for surfing & sunsets', type: 'Beach' },
    { name: 'Ubud Monkey Forest', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=250&fit=crop', desc: 'Sacred forest sanctuary with 700+ monkeys', type: 'Nature' },
  ],
  manali: [
    { name: 'Rohtang Pass', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=250&fit=crop', desc: 'High mountain pass at 3,978m — snow all year', type: 'Nature' },
    { name: 'Solang Valley', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', desc: 'Adventure sports hub — skiing, paragliding & zorbing', type: 'Adventure' },
    { name: 'Hadimba Temple', img: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=250&fit=crop', desc: '16th century wooden temple in cedar forest', type: 'Spiritual' },
    { name: 'Old Manali Market', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop', desc: 'Hippie cafes, local shops & Tibetan food', type: 'Food' },
  ],
  jaipur: [
    { name: 'Amber Fort', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop', desc: 'Magnificent hilltop fort with elephant rides', type: 'Historical' },
    { name: 'Hawa Mahal', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=250&fit=crop', desc: 'Palace of Winds — 953 small windows', type: 'Historical' },
    { name: 'Johari Bazaar', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop', desc: 'Famous market for jewelry, textiles & handicrafts', type: 'Shopping' },
    { name: 'City Palace', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=250&fit=crop', desc: 'Royal palace complex in the heart of Jaipur', type: 'Historical' },
  ],
  kerala: [
    { name: 'Alleppey Backwaters', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop', desc: 'Iconic houseboat rides through serene backwaters', type: 'Nature' },
    { name: 'Munnar Tea Gardens', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', desc: 'Lush green tea plantations in the Western Ghats', type: 'Nature' },
    { name: 'Kovalam Beach', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', desc: 'Crescent-shaped beach with lighthouse views', type: 'Beach' },
    { name: 'Periyar Wildlife Sanctuary', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=250&fit=crop', desc: 'Tiger reserve with elephant sightings & boat safari', type: 'Nature' },
  ],
  agra: [
    { name: 'Taj Mahal', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=250&fit=crop', desc: 'UNESCO World Heritage — one of the 7 wonders', type: 'Historical' },
    { name: 'Agra Fort', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', desc: 'Massive Mughal fort with stunning architecture', type: 'Historical' },
    { name: 'Fatehpur Sikri', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop', desc: 'Abandoned Mughal city — UNESCO World Heritage', type: 'Historical' },
    { name: 'Mehtab Bagh', img: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=250&fit=crop', desc: 'Best sunset view of Taj Mahal from across Yamuna', type: 'Nature' },
  ],
  varanasi: [
    { name: 'Dashashwamedh Ghat', img: 'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=400&h=250&fit=crop', desc: 'Main ghat — famous for Ganga Aarti every evening', type: 'Spiritual' },
    { name: 'Kashi Vishwanath Temple', img: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=250&fit=crop', desc: 'One of the 12 Jyotirlingas — most sacred Shiva temple', type: 'Spiritual' },
    { name: 'Sarnath', img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=250&fit=crop', desc: 'Where Buddha gave his first sermon — Buddhist pilgrimage', type: 'Spiritual' },
    { name: 'Boat Ride on Ganges', img: 'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=400&h=250&fit=crop', desc: 'Sunrise boat ride past ancient ghats — unmissable', type: 'Culture' },
  ],
  andaman: [
    { name: 'Radhanagar Beach', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=250&fit=crop', desc: "Asia's best beach — crystal clear turquoise water", type: 'Beach' },
    { name: 'Cellular Jail', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', desc: 'Historic colonial prison — light & sound show at night', type: 'Historical' },
    { name: 'Scuba Diving at Havelock', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', desc: 'World-class diving with coral reefs & sea turtles', type: 'Adventure' },
    { name: 'Neil Island', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop', desc: 'Peaceful island with natural rock bridge & snorkeling', type: 'Nature' },
  ],
};

const TYPE_COLORS = {
  Historical: '#f59e0b', Food: '#10b981', Beach: '#06b6d4',
  Nature: '#22c55e', Spiritual: '#a78bfa', Landmark: '#f43f5e',
  Museum: '#3b82f6', Culture: '#ec4899', Shopping: '#f97316',
  Adventure: '#ef4444',
};

const getDestImage = (destination) => {
  const d = destination.toLowerCase();
  for (const [key, url] of Object.entries(DEST_IMAGES)) {
    if (d.includes(key)) return url;
  }
  return DEST_IMAGES.default;
};

const getRealPlaces = (destination) => {
  const d = destination.toLowerCase();
  for (const [key, places] of Object.entries(REAL_PLACES)) {
    if (d.includes(key)) return places;
  }
  return null;
};

const TripResult = ({ tripData, onClose }) => {
  const [expandedDays, setExpandedDays] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const toast = useToast();
  const heroImg = getDestImage(tripData.destination);
  const realPlaces = getRealPlaces(tripData.destination);
  const allDays = tripData.dailyItinerary || [];
  const visibleDays = expandedDays ? allDays : allDays.slice(0, 3);
  const galleryImages = realPlaces ? realPlaces.map(p => ({ src: p.img, caption: p.name })) : [];

  const shareOnWhatsApp = () => {
    const phone = tripData.userDetails?.phone || '';
    const link = getWhatsAppLink(phone, tripData.userDetails?.name || 'Traveler', tripData);
    window.open(link, '_blank');
  };

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210; let y = 20;

      // Header
      doc.setFillColor(244, 63, 94);
      doc.rect(0, 0, W, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text(`✈ ${tripData.destination}`, 15, 18);
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      doc.text(`${tripData.duration} · ${tripData.dates}`, 15, 28);
      doc.text('Generated by AI Travel Planner', 15, 36);

      y = 52;
      doc.setTextColor(30, 30, 30);

      // Overview
      doc.setFontSize(14); doc.setFont('helvetica', 'bold');
      doc.setTextColor(244, 63, 94); doc.text('Trip Overview', 15, y); y += 8;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
      const overviewLines = doc.splitTextToSize(tripData.overview || '', W - 30);
      doc.text(overviewLines, 15, y); y += overviewLines.length * 5 + 8;

      // Highlights
      if (tripData.highlights?.length) {
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(244, 63, 94);
        doc.text('Top Highlights', 15, y); y += 8;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
        tripData.highlights.forEach(h => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`• ${h}`, 18, y); y += 6;
        });
        y += 4;
      }

      // Budget
      if (tripData.budgetEstimate) {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(244, 63, 94);
        doc.text('Budget Estimate', 15, y); y += 8;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
        Object.entries(tripData.budgetEstimate).forEach(([k, v]) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`, 18, y); y += 6;
        });
        y += 4;
      }

      // Daily Itinerary
      if (allDays.length) {
        doc.addPage(); y = 20;
        doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(244, 63, 94);
        doc.text('Daily Itinerary', 15, y); y += 10;

        allDays.forEach(day => {
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(244, 63, 94);
          doc.text(`Day ${day.day} — ${day.title}`, 15, y); y += 7;
          doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80);
          day.activities?.forEach(act => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 50, 50);
            doc.text(`${act.time} — ${act.activity}`, 18, y); y += 5;
            doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
            doc.text(`📍 ${act.location} · ${act.cost}`, 22, y); y += 5;
          });
          y += 4;
        });
      }

      // Travel Tips
      if (tripData.travelTips?.length) {
        if (y > 230) { doc.addPage(); y = 20; }
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(244, 63, 94);
        doc.text('Travel Tips', 15, y); y += 8;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
        tripData.travelTips.forEach(t => {
          if (y > 270) { doc.addPage(); y = 20; }
          const lines = doc.splitTextToSize(`• ${t}`, W - 30);
          doc.text(lines, 18, y); y += lines.length * 5 + 2;
        });
      }

      // Footer
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(180, 180, 180);
        doc.text(`AI Travel Planner · Page ${i} of ${pages}`, W / 2, 290, { align: 'center' });
      }

      doc.save(`${tripData.destination.replace(/[^a-zA-Z0-9]/g, '_')}_trip_plan.pdf`);
      toast('PDF downloaded successfully! 📄', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      toast('PDF generation failed. Try again.', 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  const getMapsUrl = (dest) =>
    `https://www.google.com/maps/search/${encodeURIComponent(dest)}`;

  const getMapsEmbed = (dest) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(dest)}&output=embed&z=11`;

  return (
    <div className="trip-result-overlay">
      <div className="trip-result-modal">
        <div className="result-header">
          <h2>🎉 Your Trip Plan is Ready!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="destination-card">
          <div className="destination-hero-image">
            <img src={heroImg} alt={tripData.destination} onError={e => { e.target.src = DEST_IMAGES.default; }} />
            <div className="destination-overlay">
              <h3>{tripData.destination}</h3>
              <div className="trip-meta">
                <span>📅 {tripData.duration}</span>
                <span>📆 {tripData.dates}</span>
              </div>
              <a href={getMapsUrl(tripData.destination)} target="_blank" rel="noopener noreferrer" className="maps-link">🗺️ View on Google Maps</a>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="maps-embed-wrap">
          <iframe
            title="destination-map"
            src={getMapsEmbed(tripData.destination)}
            className="maps-embed"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="overview-section">
          <h4>Trip Overview</h4>
          <p>{tripData.overview}</p>
        </div>

        {/* Photo Gallery */}
        {galleryImages.length > 0 && (
          <div className="gallery-section">
            <h4>📸 Photo Gallery</h4>
            <div className="gallery-grid">
              {galleryImages.map((img, i) => (
                <div key={i} className="gallery-item" onClick={() => setGalleryIdx(i)}>
                  <img src={img.src} alt={img.caption} onError={e => { e.target.src = DEST_IMAGES.default; }} />
                  <div className="gallery-caption">{img.caption}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {galleryIdx !== null && (
          <div className="lightbox" onClick={() => setGalleryIdx(null)}>
            <button className="lb-prev" onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i - 1 + galleryImages.length) % galleryImages.length); }}>‹</button>
            <div className="lb-content" onClick={e => e.stopPropagation()}>
              <img src={galleryImages[galleryIdx].src} alt={galleryImages[galleryIdx].caption} />
              <div className="lb-caption">{galleryImages[galleryIdx].caption}</div>
              <div className="lb-counter">{galleryIdx + 1} / {galleryImages.length}</div>
            </div>
            <button className="lb-next" onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i + 1) % galleryImages.length); }}>›</button>
            <button className="lb-close" onClick={() => setGalleryIdx(null)}>✕</button>
          </div>
        )}

        {realPlaces && (
          <div className="highlights-section">
            <h4>🏙️ Famous Places to Visit</h4>
            <div className="real-places-grid">
              {realPlaces.map((place, i) => (
                <div key={i} className="real-place-card">
                  <div className="real-place-img">
                    <img src={place.img} alt={place.name} onError={e => { e.target.src = DEST_IMAGES.default; }} />
                    <span className="place-type-badge" style={{ background: TYPE_COLORS[place.type] || '#f43f5e' }}>{place.type}</span>
                  </div>
                  <div className="real-place-info">
                    <h5>{place.name}</h5>
                    <p>{place.desc}</p>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + tripData.destination)}`} target="_blank" rel="noopener noreferrer" className="place-maps-link">📍 View on Maps</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!realPlaces && tripData.highlights && (
          <div className="highlights-section">
            <h4>✨ Top Highlights</h4>
            <div className="highlights-grid">
              {tripData.highlights.map((h, i) => (
                <div key={i} className="highlight-item"><div className="highlight-text"><span>{h}</span></div></div>
              ))}
            </div>
          </div>
        )}

        {tripData.budgetEstimate && (
          <div className="budget-section">
            <h4>💰 Budget Estimate</h4>
            <div className="budget-grid">
              {Object.entries(tripData.budgetEstimate).map(([key, value]) => (
                <div key={key} className="budget-item">
                  <span className="budget-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="budget-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {allDays.length > 0 && (
          <div className="itinerary-preview">
            <h4>📋 Daily Itinerary</h4>
            <div className="day-cards">
              {visibleDays.map((day, index) => (
                <div key={index} className="day-card">
                  <div className="day-header">
                    <span className="day-number">Day {day.day}</span>
                    <span className="day-title">{day.title}</span>
                    <span className="day-date">{day.date}</span>
                  </div>
                  <div className="day-activities">
                    {day.activities?.map((act, ai) => (
                      <div key={ai} className="activity-item-enhanced">
                        <div className="activity-details">
                          <div className="activity-header">
                            <span className="activity-time">{act.time}</span>
                            <span className="activity-cost">{act.cost}</span>
                          </div>
                          <h5 className="activity-name">{act.activity}</h5>
                          <p className="activity-description">{act.description}</p>
                          <div className="activity-location">
                            <a href={`https://www.google.com/maps/search/${encodeURIComponent(act.location)}`} target="_blank" rel="noopener noreferrer">📍 {act.location}</a>
                            <span>⏱️ {act.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {allDays.length > 3 && (
              <button className="expand-days-btn" onClick={() => setExpandedDays(e => !e)}>
                {expandedDays ? '▲ Show Less' : `▼ Show All ${allDays.length} Days`}
              </button>
            )}
          </div>
        )}

        <PackingList destination={tripData.destination} />
        <WeatherWidget destination={tripData.destination} />

        <TripShareLink tripData={tripData} />

        <div className="user-info">
          <h4>👤 Trip Details For:</h4>
          <div className="user-details">
            <span>📧 {tripData.userDetails?.email}</span>
            <span>📱 {tripData.userDetails?.phone}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="share-btn whatsapp" onClick={shareOnWhatsApp}>📱 Share on WhatsApp</button>
          <button className="share-btn download" onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading ? '⏳ Generating PDF...' : '📄 Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripResult;
