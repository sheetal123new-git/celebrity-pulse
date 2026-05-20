export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { q, from, to, pageSize = '10' } = req.query;
  const KEY = process.env.NEWS_API_KEY;

  if (!KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured on server.' });
  if (!q)   return res.status(400).json({ error: 'Missing query param: q' });

  const url = new URL('https://gnews.io/api/v4/search');
  url.searchParams.set('q', q);
  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', pageSize);
  url.searchParams.set('token', KEY);
  if (from) url.searchParams.set('from', from);
  if (to)   url.searchParams.set('to', to);

  try {
    const apiRes = await fetch(url.toString());
    const data   = await apiRes.json();
    if (data.errors) return res.status(400).json({ error: data.errors.join(', ') });

    const articles = (data.articles || []).map(function(a) {
      return {
        title:       a.title,
        description: a.description,
        url:         a.url,
        source:      { name: a.source && a.source.name ? a.source.name : '' }
      };
    });

    res.json({ status: 'ok', totalResults: data.totalArticles || articles.length, articles: articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach GNews: ' + err.message });
  }
}
