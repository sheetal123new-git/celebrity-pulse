
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const from = req.query.from;
  const to = req.query.to;
  const KEY = process.env.NEWS_API_KEY;

  if (!KEY) {
    return res.status(500).json({ error: 'NEWS_API_KEY not configured on server.' });
  }

  try {
    // Fetch 3 pages of 50 articles = 150 articles total for better coverage
    var allArticles = [];
    for (var page = 1; page <= 3; page++) {
      const params = new URLSearchParams();
      params.set('api-key', KEY);
      params.set('q', 'celebrity OR actor OR actress OR singer OR musician OR entertainment');
      params.set('show-fields', 'headline,trailText,shortUrl');
      params.set('page-size', '50');
      params.set('page', String(page));
      params.set('order-by', 'newest');
      if (from) params.set('from-date', from);
      if (to)   params.set('to-date', to);

      const url = 'https://content.guardianapis.com/search?' + params.toString();
      const apiRes = await fetch(url);
      const data = await apiRes.json();

      if (!data.response || data.response.status !== 'ok') {
        return res.status(400).json({ error: 'Guardian API error: ' + JSON.stringify(data) });
      }

      const results = data.response.results || [];
      if (!results.length) break;

      results.forEach(function(a) {
        allArticles.push({
          title:       (a.fields && a.fields.headline)  ? a.fields.headline  : a.webTitle,
          description: (a.fields && a.fields.trailText) ? a.fields.trailText : '',
          url:         (a.fields && a.fields.shortUrl)  ? a.fields.shortUrl  : a.webUrl,
          publishedAt: a.webPublicationDate || '',
          source:      { name: 'The Guardian' }
        });
      });

      // Stop early if we have fewer than 50 results (last page)
      if (results.length < 50) break;
    }

    return res.status(200).json({ status: 'ok', totalResults: allArticles.length, articles: allArticles });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Guardian API: ' + err.message });
  }
};
