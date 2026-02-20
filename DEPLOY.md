# Railway Deployment Guide

This app deploys as **two separate Railway services**:
1. **Backend** — Flask API (from `/backend` directory)
2. **Frontend** — React static site (from `/frontend` directory)

---

## Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select the `article-publisher` repository

---

## Step 2: Deploy Backend

1. In your Railway project, click **+ New Service** → **GitHub Repo**
2. Select `article-publisher`, set **Root Directory** to `backend`
3. Railway will auto-detect Python and use the `Procfile`

### Set Backend Environment Variables
In the backend service settings → Variables, add:

```
SECRET_KEY=<generate a random 32-char string>
JWT_SECRET_KEY=<generate another random 32-char string>
FLASK_ENV=production
DATABASE_URL=sqlite:///articles.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=5242880
```

> Generate secrets: `python3 -c "import secrets; print(secrets.token_hex(32))"`

4. After deploy, note your backend URL: `https://backend-xxx.railway.app`

---

## Step 3: Deploy Frontend

1. In your Railway project, click **+ New Service** → **GitHub Repo**
2. Select `article-publisher`, set **Root Directory** to `frontend`
3. Railway will detect Vite/Node and build automatically

### Set Frontend Environment Variables
In the frontend service settings → Variables, add:

```
VITE_API_URL=https://your-backend-xxx.railway.app
```

Replace with your actual backend URL from Step 2.

### Frontend Build Command (set in Railway settings)
- **Build Command**: `npm run build`
- **Start Command**: `npx serve -s dist -l $PORT`

> If `serve` isn't installed, add it: change start command to `npm install -g serve && serve -s dist -l $PORT`

---

## Step 4: Configure CORS (Optional)

If your frontend is on a different domain, update `backend/app/__init__.py`:
```python
CORS(app, resources={r"/api/*": {"origins": ["https://your-frontend.railway.app"]}})
```

Then redeploy the backend.

---

## Quick CLI Deployment (Alternative)

If you have Railway CLI installed and logged in:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init --name article-publisher-backend
railway up

# Deploy frontend (in another terminal)
cd frontend
railway init --name article-publisher-frontend
railway up
```

---

## Checking Logs

```bash
railway logs --service backend
railway logs --service frontend
```

---

## Notes on SQLite + Railway

- SQLite data is stored on Railway's ephemeral disk
- Data **will reset** when the service redeploys
- For production use, switch to Railway's built-in PostgreSQL:
  1. Add PostgreSQL plugin to your Railway project
  2. Railway will auto-set `DATABASE_URL` to the PostgreSQL connection string
  3. Update `requirements.txt` to add `psycopg2-binary`
  4. No other code changes needed (SQLAlchemy handles both SQLite and PostgreSQL)
