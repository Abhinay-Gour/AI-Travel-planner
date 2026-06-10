import React, { useState, useEffect, useRef } from 'react';
import { generateTripPlan, generateTripSummary } from '../services/geminiService';
import { sendTripPlanDirectly } from '../services/autoSendService';
import { saveTrip } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { sanitize } from '../services/secureStorage';
import './TripPlannerForm.css';

const TripPlannerForm = ({ initialDestination = '', onTripGenerated, onClose, user }) => {
  const toast = useToast();
  const destInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [formData, setFormData] = useState({
    destination: initialDestination,
    startDate: '',
    endDate: '',
    days: '',
    preferences: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, destination: initialDestination }));
  }, [initialDestination]);

  // Google Places Autocomplete
  useEffect(() => {
    if (!destInputRef.current || !window.google?.maps?.places) return;
    const autocomplete = new window.google.maps.places.Autocomplete(destInputRef.current, {
      types: ['(cities)'],
      fields: ['name', 'formatted_address'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const name = place.formatted_address || place.name || '';
      setFormData(prev => ({ ...prev, destination: name }));
    });
    autocompleteRef.current = autocomplete;
    return () => window.google?.maps?.event?.clearInstanceListeners(autocomplete);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'startDate' || name === 'endDate') {
      const start = name === 'startDate' ? new Date(value) : new Date(formData.startDate);
      const end = name === 'endDate' ? new Date(value) : new Date(formData.endDate);
      if (start && end && end > start) {
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, days: diffDays.toString() }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate max days
    if (parseInt(formData.days) > 30) {
      toast('Maximum trip duration is 30 days', 'warning');
      return;
    }

    setLoading(true);
    try {
      const tripPlan = await generateTripPlan(
        sanitize(formData.destination),
        formData.startDate,
        formData.endDate,
        formData.days,
        sanitize(formData.preferences)
      );

      const completeData = {
        ...tripPlan,
        userDetails: { name: user.name, email: user.email, phone: user.phone },
        summary: generateTripSummary(tripPlan)
      };

      onTripGenerated(completeData);

      // Background tasks
      saveTrip({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        ...tripPlan
      }).catch(() => {});

      sendTripPlanDirectly(user, completeData).catch(() => {});

    } catch {
      toast('Error generating trip plan. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="trip-planner-overlay" role="dialog" aria-modal="true" aria-label="Trip Planner">
      <div className="trip-planner-modal">
        <div className="modal-header">
          <h2>Plan Your Perfect Trip</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
          <div className="user-info">
            <p>Planning for: <strong>{user.name}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-step">
            <h3>Trip Details</h3>

            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <input
                id="destination"
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g. Paris, France"
                maxLength={100}
                required
                autoComplete="off"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || getTomorrowDate()}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="days">Duration</label>
              <input
                id="days"
                type="text"
                name="days"
                value={formData.days ? `${formData.days} days` : ''}
                readOnly
                placeholder="Auto-calculated"
                aria-label="Trip duration in days"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferences">Preferences (Optional)</label>
              <textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                placeholder="e.g. Adventure activities, vegetarian food, budget travel..."
                rows="3"
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className="btn-generate"
              disabled={loading || !formData.destination || !formData.startDate || !formData.endDate}
              aria-busy={loading}
            >
              {loading ? 'Generating & Auto-Sending...' : 'Generate My Trip 🚀'}
            </button>

            <div className="auto-send-info" aria-label="Auto-send information">
              <div className="auto-send-badge">
                <span aria-hidden="true">🚀</span>
                <div>
                  <strong>Auto-Send Enabled</strong>
                  <p>Trip details will be sent automatically to:</p>
                </div>
              </div>
              <div className="send-targets">
                <div className="send-target"><span aria-hidden="true">📧</span><span>{user.email}</span></div>
                <div className="send-target"><span aria-hidden="true">📱</span><span>{user.phone}</span></div>
              </div>
            </div>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>AI is creating your perfect trip plan...</p>
            <p className="loading-sub">Will auto-send to your email & WhatsApp when ready!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerForm;
