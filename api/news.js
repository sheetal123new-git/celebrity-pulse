export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { from, to } = req.query;
  const KEY = process.env.NEWS_API_KEY;

  if (!KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured on server.' });

  const url = new URL('https://content.guardianapis.com/search');
  url.searchParams.set('api-key', KEY);
  url.searchParams.set('q', 'celebrity OR actor OR actress OR singer OR musician OR Hollywood OR entertainment');
  url.searchParams.set('section', 'culture|film|music|tv-and-radio|stage|media');
  url.searchParams.set('show-fields', 'headline,trailText,shortUrl');
  url.searchParams.set('page-size', '50');
  url.searchParams.set('order-by', 'newest');
  if (from) url.searchParams.set('from-date', from);
  if (to)   url.searchParams.set('to-date', to);

  try {
    const apiRes = await fetch(url.toString());
    const data   = await apiRes.json();

    if (data.response.status !== 'ok') {
      return res.status(400).json({ error: 'Guardian API error: ' + data.response.status });
    }

    const articles = (data.response.results || []).map(function(a) {
      return {
        title:       a.fields && a.fields.headline ? a.fields.headline : a.webTitle,
        description: a.fields && a.fields.trailText ? a.fields.trailText : '',
  
