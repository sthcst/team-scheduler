# Team Scheduler - Render Deployment Guide

This guide walks you through deploying the Team Schedule Generator to Render.com with both backend API and frontend static hosting.

## Prerequisites

- GitHub account with the team-scheduler repository
- Render.com account (free tier available at https://render.com)
- Git installed locally

## Deployment Overview

The app requires two separate Render services:
1. **Backend Web Service** - Node.js Express API (runs server.js)
2. **Frontend Static Site** - React build output

---

## Part 1: Deploy Backend to Render

### Step 1: Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **+ New** → **Web Service**
3. Select **Connect a GitHub repository**
   - Search for and select `team-scheduler`
   - Click **Connect**

### Step 2: Configure Backend Settings

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `team-scheduler-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Node Version** | `18` (or latest available) |

**Advanced Settings (Optional)**
- Plan: Free (spins down after 15 min inactivity)

### Step 3: Deploy

1. Click **Create Web Service**
2. Wait for deployment (takes 2-3 minutes)
3. Once deployed, copy the service URL (e.g., `https://team-scheduler-api.onrender.com`)
4. Save this URL for Step 1 of Part 2

**Note**: Free tier services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## Part 2: Deploy Frontend to Render

### Step 1: Update Frontend Configuration with Backend URL

1. In your local repository, create `.env.production` in the `client/` folder:

```bash
cd client
echo REACT_APP_API_URL=https://team-scheduler-api.onrender.com > .env.production
```

Replace `https://team-scheduler-api.onrender.com` with your actual backend URL from Part 1.

2. Rebuild the frontend:

```bash
npm run build
```

3. Commit the changes:

```bash
git add client/.env.production
git commit -m "Add Render backend URL for production"
git push origin main
```

### Step 2: Create Frontend Static Site

1. In Render Dashboard, click **+ New** → **Static Site**
2. Select and connect the `team-scheduler` repository
3. Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `team-scheduler-web` |
| **Build Command** | `cd client && npm install && npm run build` |
| **Publish Directory** | `client/build` |

4. Click **Create Static Site**

### Step 3: Wait for Deployment

- Frontend deployment takes 2-3 minutes
- Once live, you'll see the URL in the dashboard (e.g., `https://team-scheduler-web.onrender.com`)

---

## Part 3: Verify Full-Stack Integration

1. Visit your frontend URL: `https://team-scheduler-web.onrender.com`
2. Fill out the schedule generator form
3. Verify that:
   - Data saves correctly
   - Schedule generates successfully
   - No API errors appear in browser console

**If you see API errors:**
- Check that `REACT_APP_API_URL` is set correctly
- Ensure backend Web Service is deployed and running
- Check backend logs in Render Dashboard for errors

---

## Production Environment Variables

### Frontend (.env.production in client/)

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Backend (server.js)

The backend uses default configuration. Optional environment variables:

```
NODE_ENV=production
PORT=5000 (automatically set by Render)
```

---

## Monitoring & Troubleshooting

### View Backend Logs
1. Go to backend service in Render Dashboard
2. Click **Logs** tab
3. Look for startup messages and errors

### View Frontend Logs
1. Go to frontend site in Render Dashboard
2. Check deployment logs for build errors

### Common Issues

**Issue: Blank page on frontend**
- Ensure `REACT_APP_API_URL` is set correctly in `.env.production`
- Rebuild and redeploy frontend
- Clear browser cache and hard refresh

**Issue: API 502/503 errors**
- Backend service may be spinning up (free tier takes ~30 sec after spin-down)
- Check backend logs for errors
- Verify backend URL in frontend `.env.production`

**Issue: CORS errors**
- Backend has CORS enabled for all origins (development mode)
- No additional configuration needed

---

## Updating the App

### Push Updates to Backend

1. Commit changes locally:
```bash
git add .
git commit -m "Update backend features"
git push origin main
```

2. Backend auto-deploys when `main` branch updates (if auto-deploy enabled)

### Push Updates to Frontend

1. Commit changes and build locally:
```bash
cd client
npm run build
git add .
git commit -m "Update frontend"
git push origin main
```

2. Frontend auto-deploys when `main` branch updates

---

## Performance Notes

- **Free Tier Limits**: Services spin down after 15 min inactivity
- **Cold Start**: First request after spin-down takes ~30 seconds
- **Data Persistence**: Data stored in-memory (lost when service restarts)
  - For persistent data, upgrade to paid tier and add MongoDB/PostgreSQL
- **Build Time**: Frontend builds take 1-2 minutes

---

## Next Steps (Optional Enhancements)

1. **Persistent Database**: Add MongoDB Atlas for team/schedule data persistence
2. **SSL Certificate**: Render provides free SSL automatically
3. **Custom Domain**: Add custom domain in Render dashboard settings
4. **Auto-Deploy**: Enable automatic deployment on GitHub push in Render settings
5. **Email Notifications**: Add email service for schedule alerts

---

## Support

For issues with Render:
- Check [Render Documentation](https://render.com/docs)
- Review deployment logs in Render Dashboard
- Contact Render support

For issues with the app:
- Check browser console (F12 → Console tab)
- Review backend logs in Render Dashboard
- Check [GitHub Issues](https://github.com/sthcst/team-scheduler/issues)

---

## Rollback (Emergency)

If deployment breaks production:

1. Go to Render Dashboard → Backend/Frontend service
2. Click **Deployments**
3. Click **Rollback** next to previous working version
4. Fix issues locally and re-deploy

---

**Success! Your Team Schedule Generator is now live on Render! 🎉**
