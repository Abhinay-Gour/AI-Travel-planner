# AI Travel Planner Backend

A comprehensive Node.js backend for the AI Travel Planner application with advanced features including real authentication, trip management, email/SMS notifications, weather integration, and social features.

## 🚀 Features

### Core Features
- **User Authentication** - JWT-based auth with email verification
- **Trip Management** - CRUD operations for personalized trip plans
- **AI Integration** - Google Gemini API for intelligent trip generation
- **Real Communication** - Email (Nodemailer) and SMS (Twilio) sending
- **Weather Integration** - Real-time weather data and recommendations
- **Social Features** - Trip sharing, likes, comments, and discovery

### Advanced Features
- **User Dashboard** - Comprehensive travel statistics and analytics
- **Trip History** - Detailed trip tracking with filters
- **Weather Recommendations** - Smart packing and travel tips
- **Email Templates** - Beautiful HTML email templates
- **Rate Limiting** - API protection and security
- **Error Handling** - Comprehensive error management
- **Data Validation** - Input validation and sanitization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account (for email sending)
- Twilio account (for SMS - optional)
- OpenWeather API key (for weather - optional)
- Google Gemini API key

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env` file and update with your credentials:
   ```bash
   # Required
   MONGODB_URI=mongodb://localhost:27017/ai-travel
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key
   
   # Email (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   
   # Optional Services
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890
   WEATHER_API_KEY=your_openweather_key
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env** with your email and app password

## 📱 SMS Setup (Twilio - Optional)

1. **Create Twilio Account** at https://twilio.com
2. **Get credentials** from Twilio Console
3. **Update .env** with Twilio credentials
4. **Verify phone numbers** in Twilio (for free tier)

## 🌤️ Weather Setup (Optional)

1. **Get API key** from https://openweathermap.org/api
2. **Update .env** with weather API key

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Trips
- `POST /api/trips/create` - Create new trip with AI
- `GET /api/trips/my-trips` - Get user's trips
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `GET /api/trips/public/explore` - Browse public trips
- `POST /api/trips/:id/like` - Like/unlike trip
- `POST /api/trips/:id/comment` - Add comment
- `GET /api/trips/stats/overview` - Trip statistics

### Users
- `GET /api/users/dashboard` - User dashboard data
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/favorites` - Favorite trips
- `GET /api/users/trip-history` - Trip history with filters
- `GET /api/users/travel-stats` - Travel statistics
- `DELETE /api/users/account` - Delete account

### Email
- `POST /api/email/send-trip` - Send trip via email
- `POST /api/email/resend-trip/:tripId` - Resend trip email
- `POST /api/email/send-custom` - Send custom email
- `GET /api/email/history` - Email history

### Weather
- `GET /api/weather/current?location=Paris` - Current weather
- `GET /api/weather/forecast?location=Paris&startDate=2024-01-01&endDate=2024-01-07` - Weather forecast
- `GET /api/weather/recommendations?location=Paris&startDate=2024-01-01&endDate=2024-01-07` - Weather recommendations
- `POST /api/weather/compare?locations=Paris,London,Rome` - Compare weather

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  preferences: {
    budget: String,
    travelStyle: String,
    interests: [String],
    currency: String,
    language: String
  },
  stats: {
    tripsPlanned: Number,
    countriesVisited: [String],
    totalDaysPlanned: Number
  },
  isEmailVerified: Boolean,
  timestamps: true
}
```

### Trip Model
```javascript
{
  user: ObjectId,
  destination: String,
  startDate: Date,
  endDate: Date,
  duration: String,
  overview: String,
  highlights: [String],
  dailyItinerary: [{
    day: Number,
    date: String,
    title: String,
    activities: [{
      time: String,
      activity: String,
      location: String,
      description: String,
      cost: String,
      coordinates: { lat: Number, lng: Number }
    }]
  }],
  budgetEstimate: {
    total: String,
    currency: String
  },
  isPublic: Boolean,
  likes: [{ user: ObjectId }],
  comments: [{ user: ObjectId, text: String }],
  timestamps: true
}
```

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** with configurable origins
- **Helmet** for security headers
- **Environment Variables** for sensitive data

## 📊 Monitoring & Logging

- **Console Logging** with emojis for better readability
- **Error Tracking** with detailed error messages
- **API Response Logging** for debugging
- **Database Connection Monitoring**

## 🚀 Deployment

### Heroku Deployment
1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # ... set all other env vars
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Railway Deployment
1. **Connect GitHub repo** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically** on push

## 🧪 Testing

```bash
# Test API endpoints
curl -X GET http://localhost:5000/api/health

# Test with authentication
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer your_jwt_token"
```

## 📈 Performance Optimization

- **Database Indexing** for faster queries
- **Aggregation Pipelines** for complex statistics
- **Parallel Processing** for external API calls
- **Caching** strategies for frequently accessed data
- **Connection Pooling** for database connections

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

## 🔄 Updates

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added weather integration and social features
- **v1.2.0** - Enhanced email templates and user dashboard