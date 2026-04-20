import React, { useState, useEffect } from 'react';
import { getMyTrips, deleteTrip, updateTrip } from '../services/authService';
import './TripHistory.css';

const STATUS_COLORS = {
  planned:   { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', label: '📅 Planned'   },
  ongoing:   { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', label: '✈️ Ongoing'   },
  completed: { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', label: '✅ Completed'  },
  cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', label: '❌ Cancelled'  },
  draft:     { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af', label: '📝 Draft'      },
};

const TripCard = ({ trip, onDelete, onToggleFavorite, onView, onStatusChange }) => {
  const [deleting, setDeleting] = useState(false);
  const status = STATUS_COLORS[trip.status] || STATUS_COLORS.planned;

  const handleDelete = async () => {
    if (!window.confirm(`Delete trip to ${trip.destination}?`)) return;
    setDeleting(true);
    await onDelete(trip._id);
    setDeleting(false);
  };

  const fmt = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`th-card ${trip.isFavorite ? 'favorited' : ''}`}>
      <div className="th-card-top">
        <div className="th-dest-info">
          <div className="th-dest-icon">✈️</div>
          <div>
            <h3 className="th-dest-name">{trip.destination}</h3>
            <p className="th-dates">{fmt(trip.startDate)} → {fmt(trip.endDate)}</p>
          </div>
        </div>
        <button
          className={`th-fav-btn ${trip.isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(trip._id, !trip.isFavorite)}
          title={trip.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {trip.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="th-meta-row">
        <span className="th-badge th-duration">🗓️ {trip.duration}</span>
        <span className="th-badge th-style">{trip.travelStyle || 'cultural'}</span>
        <span className="th-badge th-budget-range">{trip.budgetRange || 'mid-range'}</span>
      </div>

      {trip.overview && (
        <p className="th-overview">{trip.overview.slice(0, 120)}...</p>
      )}

      {trip.highlights?.length > 0 && (
        <div className="th-highlights">
          {trip.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="th-highlight-tag">✨ {h.slice(0, 30)}</span>
          ))}
        </div>
      )}

      <div className="th-budget-row">
        <span className="th-budget-label">💰 Est. Budget</span>
        <span className="th-budget-val">{trip.budgetEstimate?.total || 'N/A'}</span>
      </div>

      <div className="th-footer">
        <div className="th-status-wrap">
          <span className="th-status" style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
          <select
            className="th-status-select"
            value={trip.status}
            onChange={(e) => onStatusChange(trip._id, e.target.value)}
          >
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div className="th-actions">
          <button className="th-btn th-view-btn" onClick={() => onView(trip)}>
            👁️ View
          </button>
          <button className="th-btn th-del-btn" onClick={handleDelete} disabled={deleting}>
            {deleting ? '...' : '🗑️'}
          </button>
        </div>
      </div>

      <div className="th-card-footer-meta">
        <span>Created: {fmt(trip.createdAt)}</span>
        {trip.emailSent && <span className="th-sent-badge">📧 Email Sent</span>}
        {trip.smsSent && <span className="th-sent-badge">📱 SMS Sent</span>}
      </div>
    </div>
  );
};

const TripDetailModal = ({ trip, onClose }) => {
  if (!trip) return null;

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="th-detail-overlay" onClick={onClose}>
      <div className="th-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="th-detail-header">
          <div>
            <h2>🌍 {trip.destination}</h2>
            <p>{fmt(trip.startDate)} → {fmt(trip.endDate)} · {trip.duration}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="th-detail-body">
          {trip.overview && (
            <div className="th-section">
              <h4>📖 Overview</h4>
              <p>{trip.overview}</p>
            </div>
          )}

          {trip.highlights?.length > 0 && (
            <div className="th-section">
              <h4>✨ Highlights</h4>
              <ul className="th-detail-list">
                {trip.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}

          {trip.budgetEstimate && (
            <div className="th-section">
              <h4>💰 Budget Breakdown</h4>
              <div className="th-budget-grid">
                {Object.entries(trip.budgetEstimate).map(([k, v]) => (
                  <div key={k} className="th-budget-item">
                    <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trip.dailyItinerary?.length > 0 && (
            <div className="th-section">
              <h4>📋 Daily Itinerary ({trip.dailyItinerary.length} days)</h4>
              <div className="th-days">
                {trip.dailyItinerary.map((day) => (
                  <div key={day.day} className="th-day">
                    <div className="th-day-header">
                      <span className="th-day-num">Day {day.day}</span>
                      <span className="th-day-title">{day.title}</span>
                      <span className="th-day-date">{day.date}</span>
                    </div>
                    {day.activities?.slice(0, 3).map((act, i) => (
                      <div key={i} className="th-activity">
                        <span className="th-act-time">{act.time}</span>
                        <div className="th-act-info">
                          <strong>{act.activity}</strong>
                          <span>📍 {act.location}</span>
                        </div>
                        <span className="th-act-cost">{act.cost}</span>
                      </div>
                    ))}
                    {day.activities?.length > 3 && (
                      <p className="th-more-acts">+{day.activities.length - 3} more activities</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {trip.travelTips?.length > 0 && (
            <div className="th-section">
              <h4>💡 Travel Tips</h4>
              <ul className="th-detail-list">
                {trip.travelTips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          {trip.packingList?.length > 0 && (
            <div className="th-section">
              <h4>🎒 Packing List</h4>
              <div className="th-packing-grid">
                {trip.packingList.map((item, i) => (
                  <span key={i} className="th-pack-item">✓ {item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TripHistory = ({ onClose }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [viewTrip, setViewTrip] = useState(null);

  const fetchTrips = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyTrips(p, 9);
      setTrips(data.trips || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrips(page); }, [page]);

  const handleDelete = async (id) => {
    await deleteTrip(id);
    setTrips(prev => prev.filter(t => t._id !== id));
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    await updateTrip(id, { isFavorite });
    setTrips(prev => prev.map(t => t._id === id ? { ...t, isFavorite } : t));
  };

  const handleStatusChange = async (id, status) => {
    await updateTrip(id, { status });
    setTrips(prev => prev.map(t => t._id === id ? { ...t, status } : t));
  };

  const filtered = trips
    .filter(t => filter === 'all' ? true : filter === 'favorites' ? t.isFavorite : t.status === filter)
    .filter(t => search ? t.destination.toLowerCase().includes(search.toLowerCase()) : true)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'destination') return a.destination.localeCompare(b.destination);
      return 0;
    });

  return (
    <>
      <div className="th-overlay" onClick={onClose}>
        <div className="th-modal" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="th-header">
            <div>
              <h2>🗺️ My Trip History</h2>
              <p>{pagination.total || 0} trips planned</p>
            </div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          {/* Controls */}
          <div className="th-controls">
            <input
              className="th-search"
              type="text"
              placeholder="🔍 Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="th-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Trips</option>
              <option value="favorites">❤️ Favorites</option>
              <option value="planned">📅 Planned</option>
              <option value="ongoing">✈️ Ongoing</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <select className="th-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="destination">A-Z</option>
            </select>
          </div>

          {/* Content */}
          <div className="th-content">
            {loading ? (
              <div className="th-loading">
                <div className="th-spinner" />
                <p>Loading your trips...</p>
              </div>
            ) : error ? (
              <div className="th-error">
                <p>❌ {error}</p>
                <button onClick={() => fetchTrips(page)}>Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="th-empty">
                <div className="th-empty-icon">✈️</div>
                <h3>{search || filter !== 'all' ? 'No trips found' : 'No trips yet!'}</h3>
                <p>{search || filter !== 'all' ? 'Try a different filter or search' : 'Plan your first trip to see it here'}</p>
                {!search && filter === 'all' && (
                  <button className="th-plan-btn" onClick={onClose}>Plan a Trip →</button>
                )}
              </div>
            ) : (
              <div className="th-grid">
                {filtered.map(trip => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onView={setViewTrip}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="th-pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span>Page {page} of {pagination.pages}</span>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {viewTrip && <TripDetailModal trip={viewTrip} onClose={() => setViewTrip(null)} />}
    </>
  );
};

export default TripHistory;
