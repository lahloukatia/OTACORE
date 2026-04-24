const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contenu, Genre } = require('../models');

// Home page
router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/landing');
  }
  res.render('home');
});

// Landing page (connected)
router.get('/landing', async (req, res) => {
  try {
    const user = req.session?.user || { username: 'TestUser' };

    const trendingAnime = await Contenu.findAll({
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

    const featured = trendingAnime.length > 0 ? trendingAnime[0] : (topManga.length > 0 ? topManga[0] : null);

    res.render('landing', {
      user,
      page: 'home',
      featured,
      trending: trendingAnime,
      topManga
    });
  } catch (error) {
    console.error('Erreur landing :', error);
    res.render('landing', {
      user: req.session?.user || { username: 'TestUser' },
      page: 'home',
      featured: null,
      trending: [],
      topManga: []
    });
  }
});

// Search
router.get('/recherche', async (req, res) => {
  try {
    const query = req.query.q || '';
    const user = req.session?.user || { username: 'TestUser' };
    let results = [];
    if (query.trim()) {
      results = await Contenu.findAll({
        where: { titre: { [Op.like]: `%${query}%` } },
        include: [{ model: Genre, through: { attributes: [] } }],
        order: [['note', 'DESC']],
        limit: 20
      });
    }
    res.render('recherche', {
      user,
      query,
      results,
      page: 'recherche'
    });
  } catch (error) {
    console.error('Erreur recherche :', error);
    res.render('recherche', {
      user: req.session?.user || { username: 'TestUser' },
      query: '',
      results: [],
      page: 'recherche'
    });
  }
});

router.get('/help', (req, res) => {
  res.render('help');
});

module.exports = router;