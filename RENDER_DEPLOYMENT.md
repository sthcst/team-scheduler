# Deploy Team Schedule Generator to Render

## Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

## Step 2: Deploy Backend

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your **team-scheduler** repository
3. Configure:
   - **Name**: team-scheduler-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. Click **"Create Web Service"**
5. Wait for deployment (2-3 minutes)
6. Copy your deployed URL (e.g., `https://team-scheduler-api.onrender.com`)

## Step 3: Update Frontend Config

Update the React app to use your Render backend:

1. Open `client/package.json`
2. Change the `proxy` field to your Render backend URL:
```json
"proxy": "https://team-scheduler-api.onrender.com"
```

3. Rebuild:
```bash
npm run build
```

## Step 4: Deploy Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select your **team-scheduler** repository
3. Configure:
   - **Name**: team-scheduler-app
   - **Build Command**: `npm run build && cd client && npm run build && cd ..`
   - **Publish Directory**: `client/build`

4. Click **"Create Static Site"**
5. Wait for deployment (2-3 minutes)

## Step 5: Update Backend for Frontend URL

Back in backend Web Service settings:
1. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your static site URL

## Done! 🎉

Your app will be live at the Static Site URL with full backend functionality!

## Troubleshooting

**Backend not connecting?**
- Check backend is running in Render dashboard
- Verify proxy URL in client/package.json
- Check CORS settings in server.js

**Static site shows blank?**
- Ensure `homepage` in client/package.json is correct
- Check build logs in Render dashboard
- Clear browser cache

**Free tier limitations:**
- Backend spins down after 15 mins of inactivity (takes 30s to wake up)
- Static site is always available
- Get paid tier for always-on backend
