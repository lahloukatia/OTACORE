const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contenu, Genre } = require('../models');

// ── Helpers ──────────────────────────────────
function levenshtein(a, b) {
  const an = a.length, bn = b.length;
  if (!an) return bn;
  if (!bn) return an;
  const m = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));
  for (let i = 0; i <= an; i++) m[i][0] = i;
  for (let j = 0; j <= bn; j++) m[0][j] = j;
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      m[i][j] = a[i - 1] === b[j - 1]
        ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]) + 1;
    }
  }
  return m[an][bn];
}
function normalize(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// ── Routes ───────────────────────────────────
router.get('/', (req, res) => {
  if (req.session?.user) return res.redirect('/landing');
  res.render('home');
});

router.get('/landing', async (req, res) => {
  try {
    const user = req.session?.user || { username: 'TestUser' };
    const trending = await Contenu.findAll({
      where: { type: 'ANIME' },
      order: [['note', 'DESC']],
      limit: 6,
      include: [{ model: Genre, through: { attributes: [] } }]
    });
    const topManga = await Contenu.findAll({
      where: { type: 'MANGA' },
      order: [['note', 'DESC']],
      limit: 6,
      include: [{ model: Genre, through: { attributes: [] } }]
    });
    const featured = trending.length ? trending[0] : (topManga.length ? topManga[0] : null);
    res.render('landing', { user, page: 'home', featured, trending, topManga });
  } catch (err) {
    console.error(err);
    res.render('landing', { user: req.session?.user || { username: 'TestUser' }, page: 'home', featured: null, trending: [], topManga: [] });
  }
});

router.get('/recherche', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    const user = req.session?.user || { username: 'TestUser' };

    const all = await Contenu.findAll({
      include: [{ model: Genre, through: { attributes: [] } }]
    });

    console.log(`\n🔍 QUERY: "${query}"`);
    console.log(`📦 DB items: ${all.length}`);

    let results = [];
    let suggestion = null;

    if (query) {
      const q = normalize(query);
      const queryLen = q.length;

      const scored = all.map(item => {
        const title = normalize(item.titre);
        const titleDist = levenshtein(q, title);

        let bestDist = titleDist;
        let matchType = 'title';

        // Only search author if query is long enough (avoids false positives on short queries)
        if (queryLen >= 3 && item.auteur) {
          const author = normalize(item.auteur);
          const authorDist = levenshtein(q, author);
          if (authorDist < bestDist) {
            bestDist = authorDist;
            matchType = 'author';
          }
        }

        const maxLen = Math.max(title.length, q.length);
        const sim = 1 - bestDist / (maxLen || 1);
        return { item, dist: bestDist, sim, title, matchType };
      });

      // Always top 6, sorted by similarity (highest first)
      results = scored
        .sort((a, b) => b.sim - a.sim)
        .slice(0, 6)
        .map(r => r.item);

      console.log(`✅ Results: ${results.length}`);
      if (results.length) {
        console.log(`🏆 Top: ${results[0].titre}`);
        results.forEach((r, i) => {
          const s = scored.find(x => x.item.id === r.id);
          console.log(`   ${i+1}. ${r.titre} (sim: ${s.sim.toFixed(2)}, match: ${s.matchType})`);
        });
      }

      // Suggestion: if top result is not an exact match, suggest it
      if (results.length > 0) {
        if (normalize(results[0].titre) !== q) {
          suggestion = results[0].titre;
        }
      } else {
        // fallback (rare)
        const closest = scored.sort((a, b) => a.dist - b.dist)[0];
        if (closest && closest.dist <= 6) {
          suggestion = closest.item.titre;
        }
      }
    }

    res.render('recherche', { user, query, results, suggestion, page: 'recherche' });
  } catch (err) {
    console.error(err);
    res.render('recherche', { user: req.session?.user || { username: 'TestUser' }, query: req.query.q || '', results: [], suggestion: null, page: 'recherche' });
  }
});

router.get('/help', (req, res) => res.render('help'));

module.exports = router;