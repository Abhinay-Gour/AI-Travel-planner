import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  time: String,
  activity: String,
  location: String,
  description: String,
  duration: String,
  cost: String,
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'shopping', 'entertainment', 'transport', 'accommodation', 'other']
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  images: [String],
  rating: Number,
  bookingUrl: String
});

const daySchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  weather: {
    temperature: String,
    condition: String,
    icon: String
  },
  activities: [activitySchema],
  totalCost: String,
  notes: String
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  country: String,
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: {
    type: String,
    required: true
  },
  dates: String,
  
  // Trip content
  overview: String,
  highlights: [String],
  dailyItinerary: [daySchema],
  
  // Budget information
  budgetEstimate: {
    accommodation: String,
    food: String,
    transport: String,
    activities: String,
    shopping: String,
    total: String,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Additional information
  travelTips: [String],
  packingList: [String],
  bestTimeToVisit: String,
  localCurrency: String,
  language: String,
  timeZone: String,
  
  // User preferences used
  preferences: String,
  travelStyle: String,
  budgetRange: String,
  
  // Trip metadata
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  
  // Social features
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  
  // AI generation metadata
  aiModel: {
    type: String,
    default: 'gemini-1.5-flash'
  },
  generationTime: Number,
  
  // Email/SMS tracking
  emailSent: {
    type: Boolean,
    default: false
  },
  smsSent: {
    type: Boolean,
    default: false
  },
  
  // Trip images
  heroImage: String,
  images: [String],
  
  // Weather data
  weatherData: [{
    date: String,
    temperature: String,
    condition: String,
    icon: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isPublic: 1, createdAt: -1 });
tripSchema.index({ 'likes.user': 1 });

// Virtual for trip URL
tripSchema.virtual('url').get(function() {
  return `/trip/${this._id}`;
});

// Method to increment views
tripSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
tripSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to add comment
tripSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.save();
};

// Method to get public trip data
tripSchema.methods.getPublicData = function() {
  const tripObject = this.toObject();
  return {
    ...tripObject,
    user: {
      _id: tripObject.user._id,
      name: tripObject.user.name,
      avatar: tripObject.user.avatar
    }
  };
};

export default mongoose.model('Trip', tripSchema);