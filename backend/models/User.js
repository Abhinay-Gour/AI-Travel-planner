import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    travelStyle: {
      type: String,
      enum: ['adventure', 'relaxation', 'cultural', 'business', 'family'],
      default: 'cultural'
    },
    interests: [{
      type: String,
      enum: ['food', 'history', 'nature', 'nightlife', 'shopping', 'art', 'sports', 'photography']
    }],
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    tripsPlanned: {
      type: Number,
      default: 0
    },
    countriesVisited: [{
      type: String
    }],
    totalDaysPlanned: {
      type: Number,
      default: 0
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'pro', 'unlimited'], default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    startDate: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update user stats when trip is created
userSchema.methods.updateTripStats = function(tripData) {
  this.stats.tripsPlanned += 1;
  this.stats.totalDaysPlanned += parseInt(tripData.duration) || 0;
  
  // Add country to visited list if not already there
  const country = tripData.destination.split(',').pop().trim();
  if (!this.stats.countriesVisited.includes(country)) {
    this.stats.countriesVisited.push(country);
  }
  
  return this.save();
};

// Get user profile without sensitive data
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

export default mongoose.model('User', userSchema);