import React, { useState, useEffect } from 'react';
import { generateTripPlan, generateTripSummary } from '../services/geminiService';
import { sendTripPlanDirectly } from '../services/autoSendService';
import { saveTrip } from '../services/authService';
import './TripPlannerForm.css';

const TripPlannerForm = ({ initialDestination = '', onTripGenerated, onClose, user }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate days when dates change
    if (name === 'startDate' || name === 'endDate') {
      const start = name === 'startDate' ? new Date(value) : new Date(formData.startDate);
      const end = name === 'endDate' ? new Date(value) : new Date(formData.endDate);
      
      if (start && end && end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({
          ...prev,
          days: diffDays.toString()
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) return;
    
    setLoading(true);

    try {
      console.log('🚀 Starting trip generation...');
      
      // Generate trip plan
      const tripPlan = await generateTripPlan(
        formData.destination,
        formData.startDate,
        formData.endDate,
        formData.days,
        formData.preferences
      );

      console.log('✅ Trip plan generated successfully');
      
      const tripSummary = generateTripSummary(tripPlan);
      
      const completeData = {
        ...tripPlan,
        userDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        summary: tripSummary
      };

      // Show results to user first
      onTripGenerated(completeData);

      // Save trip to backend in background
      saveTrip({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        ...tripPlan
      }).then(saved => {
        console.log('✅ Trip saved to DB:', saved?._id);
      }).catch(err => {
        console.error('❌ Trip save failed:', err);
      });
      
      // Auto-send email + WhatsApp in background
      sendTripPlanDirectly(user, completeData)
        .then(r => console.log('✅ Auto-send:', r.success))
        .catch(err => console.error('❌ Auto-send failed:', err));
      
    } catch (error) {
      console.error('❌ Trip generation error:', error);
      alert('Sorry, there was an error generating your trip plan. Please try again.');
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
    <div className="trip-planner-overlay">
      <div className="trip-planner-modal">
        <div className="modal-header">
          <h2>Plan Your Perfect Trip</h2>
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="user-info">
            <p>Planning for: <strong>{user.name}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-step">
            <h3>Trip Details</h3>
            
            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g. Paris, France"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
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
              <label>Duration</label>
              <input
                type="text"
                name="days"
                value={formData.days ? `${formData.days} days` : ''}
                readOnly
                placeholder="Auto-calculated"
              />
            </div>

            <div className="form-group">
              <label>Preferences (Optional)</label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleInputChange}
                placeholder="e.g. Adventure activities, vegetarian food, budget travel, luxury hotels..."
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="btn-generate"
              disabled={loading || !formData.destination || !formData.startDate || !formData.endDate}
            >
              {loading ? 'Generating & Auto-Sending...' : 'Generate My Trip 🚀'}
            </button>
            
            <div className="auto-send-info">
              <div className="auto-send-badge">
                <span>🚀</span>
                <div>
                  <strong>Auto-Send Enabled</strong>
                  <p>Trip details will be sent automatically to:</p>
                </div>
              </div>
              <div className="send-targets">
                <div className="send-target">
                  <span>📧</span>
                  <span>{user.email}</span>
                </div>
                <div className="send-target">
                  <span>📱</span>
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>AI is creating your perfect trip plan...</p>
            <p className="loading-sub">Will auto-send to your email & WhatsApp when ready!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerForm;