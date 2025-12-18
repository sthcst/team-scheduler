# 🚀 Render Deployment Checklist

Follow these steps to deploy Team Scheduler to Render.com in ~10 minutes.

## Phase 1: Backend Deployment (5 min)

- [ ] Go to https://render.com and sign up (free account)
- [ ] Click **+ New** → **Web Service**
- [ ] Connect GitHub repository `team-scheduler`
- [ ] Configure:
  - Name: `team-scheduler-api`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `node server.js`
- [ ] Click **Create Web Service** and wait for deployment
- [ ] Copy the backend URL (e.g., `https://team-scheduler-api.onrender.com`)

**✅ Backend deployed at**: ________________

## Phase 2: Frontend Configuration (2 min)

- [ ] On your local machine, create `client/.env.production`:
  ```
  REACT_APP_API_URL=https://your-backend-url-here.onrender.com
  ```
  Replace with actual backend URL from Phase 1
- [ ] Run: `cd client && npm run build`
- [ ] Commit: `git add . && git commit -m "Add Render backend URL"`
- [ ] Push: `git push origin main`

## Phase 3: Frontend Deployment (3 min)

- [ ] In Render Dashboard, click **+ New** → **Static Site**
- [ ] Connect GitHub repository `team-scheduler`
- [ ] Configure:
  - Name: `team-scheduler-web`
  - Build Command: `cd client && npm install && npm run build`
  - Publish Directory: `client/build`
- [ ] Click **Create Static Site** and wait for deployment

**✅ Frontend deployed at**: ________________

## Phase 4: Verification (Testing)

- [ ] Visit your frontend URL in browser
- [ ] Create shift times (8 time slots)
- [ ] Add team members with availability
- [ ] Configure workspace settings
- [ ] Generate schedule
- [ ] Verify schedule appears without errors

**✅ App is live!**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Clear cache, check browser console for API URL |
| API errors | Verify REACT_APP_API_URL in `.env.production` matches backend URL |
| Backend 502 error | Free tier may be spinning up (takes 30 sec) |
| Build fails | Check build logs in Render dashboard |

---

## Important Notes

- **Free Tier**: Backend spins down after 15 min inactivity (first request takes ~30 sec)
- **Data**: Currently stored in memory (lost when app restarts)
- **Updates**: Auto-deploy enabled - push to main branch to update live app
- **GitHub Pages**: Still available at https://sthcst.github.io/team-scheduler/ (static preview only)

---

**Need help?** See [RENDER_DEPLOYMENT_SETUP.md](./RENDER_DEPLOYMENT_SETUP.md) for detailed guide.
