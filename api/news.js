export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { q, from, pageSize = '100' } = req.query;
  const KEY = process.env.NEWS_API_KEY;

  if (!KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured on server.' });
  if (!q)   return res.status(400).json({ error: 'Missing query param: q' });

  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q', q);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', pageSize);
  url.searchParams.set('apiKey', KEY);
  if (from) url.searchParams.set('from', from);

  try {
    const apiRes = await fetch(url.toString());
    const data   = await apiRes.json();
    if (data.status !== 'ok') return res.status(400).json({ error: data.message || 'NewsAPI error' });
    res.json({ status: 'ok', totalResults: data.totalResults, articles: data.articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach NewsAPI: ' + err.message });
  }
}
