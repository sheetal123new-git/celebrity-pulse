# Celebrity Pulse 🌟

Deploy once to Vercel → get a permanent URL → open in any browser, no terminal, no localhost.

---

## Deploy in 3 steps (5 minutes total)

### Step 1 — Get your free NewsAPI key
Sign up at https://newsapi.org and copy your API key.

### Step 2 — Deploy to Vercel
1. Go to https://vercel.com and sign up free (use GitHub/Google login)
2. Click **"Add New Project"**
3. Choose **"Upload"** (or drag this folder)
4. Upload this entire folder

### Step 3 — Add your API key
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `NEWS_API_KEY`
   - **Value:** your NewsAPI key
3. Click **Save** and then **Redeploy**

That's it! Vercel gives you a URL like `https://celebrity-pulse-xyz.vercel.app`.
Share it with anyone — no login, no terminal, no API key entry ever.

---

## What the app does
- Pick a time range (24 hrs → 30 days) and click Analyse
- Scans 100 latest celebrity news articles from NewsAPI
- Extracts celebrity names, counts mentions, judges sentiment
- Shows a ranked leaderboard with article links

---

## Notes
- Free NewsAPI plan: 100 requests/day, articles up to 1 month old
- Free Vercel plan: unlimited deploys, generous bandwidth
- The API key is stored only in Vercel's environment — never visible to users
