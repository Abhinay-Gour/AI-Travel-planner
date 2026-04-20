# 🚀 Deployment Guide — AI Travel Planner

## Architecture
- **Frontend** → Vercel (free)
- **Backend** → Render (free)
- **Database** → MongoDB Atlas (already configured)

---

## Step 1: Deploy Backend on Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo → select `backend` folder
3. Set these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18

4. Add Environment Variables on Render dashboard:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...your atlas uri...
JWT_SECRET=ai_travel_super_secret_jwt_key_2024
JWT_REFRESH_SECRET=ai_travel_refresh_secret_key_2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-app.vercel.app   ← add AFTER frontend deploy
```

5. Click **Deploy** → Copy the URL (e.g. `https://ai-travel-backend.onrender.com`)

---

## Step 2: Deploy Frontend on Vercel

1. Go to https://vercel.com → New Project
2. Connect GitHub → select `Ai travel` folder
3. Set these settings:
   - **Root Directory**: `Ai travel`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables on Vercel dashboard:
```
VITE_API_URL=https://ai-travel-backend.onrender.com/api
VITE_GEMINI_API_KEY=your_gemini_key
```

5. Click **Deploy** → Copy the URL (e.g. `https://ai-travel.vercel.app`)

---

## Step 3: Update FRONTEND_URL in Render

1. Go back to Render → your backend service → Environment
2. Update `FRONTEND_URL` = `https://ai-travel.vercel.app`
3. Click **Save** → backend will auto-redeploy

---

## Local Development

### Start Backend:
```bash
cd backend
npm start
```

### Start Frontend:
```bash
cd "Ai travel"
npm run dev
```

Frontend runs on: http://localhost:5173
Backend runs on: http://localhost:5001
