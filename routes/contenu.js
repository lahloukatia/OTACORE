const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Contenu, Genre, Historique } = require('../models');

// Helper to get current user
function getUser(req) {
  return req.session?.user || { username: 'TestUser' };
}

// ── Page Catalogue Anime ─────────────────
router.get('/anime', async (req, res) => {
  try {
    const filters = {
      genre:   req.query.genre   || '',
      statut:  req.query.statut  || '',
      rating:  req.query.rating  || '',
      saisons: req.query.saisons || '',
    };

    // Build where condition for Contenu
    const where = { type: 'ANIME' };

    // Statut filter
    if (filters.statut) {
      where.statut = filters.statut; // 'EN_COURS' or 'TERMINE'
    }

    // Rating filter (minimum)
    if (filters.rating) {
      where.note = { [Op.gte]: parseFloat(filters.rating) };
    }

    // Seasons filter
    if (filters.saisons) {
      const s = filters.saisons;
      if (s === '3') where.nb_saisons = { [Op.gte]: 3 };
      else if (s === '2') where.nb_saisons = 2;
      else if (s === '1') where.nb_saisons = 1;
    }

    // Genre filter (many-to-many) – use libelle
    const include = [];
    if (filters.genre) {
      include.push({
        model: Genre,
        where: { libelle: filters.genre },   // ✅ fixed
        through: { attributes: [] },
      });
    } else {
      // If no genre filter, still include genres for display
      include.push({
        model: Genre,
        through: { attributes: [] },
      });
    }

    // Query
    const contenus = await Contenu.findAll({
      where,
      include: include.length > 0 ? include : undefined,
      order: [['note', 'DESC']],
    });

    // Featured: take a random one (or the first)
    const featured = contenus.length > 0
      ? contenus[Math.floor(Math.random() * contenus.length)]
      : null;

    // All available genres (for the filter dropdown)
    const allGenres = await Genre.findAll({
      include: [{
        model: Contenu,
        where: { type: 'ANIME' },
        through: { attributes: [] },
      }],
      order: [['libelle', 'ASC']],   // ✅ fixed
    });

    res.render('catalogue', {
      type: 'ANIME',
      contenus,
      featured,
      genres: allGenres,            // array of Genre objects
      filters,
      user: getUser(req),
      page: 'anime',
    });
  } catch (error) {
    console.error('Erreur catalogue anime :', error);
    res.render('catalogue', {
      type: 'ANIME',
      contenus: [],
      featured: null,
      genres: [],
      filters: {},
      user: getUser(req),
      page: 'anime',
    });
  }
});

// ── Page Catalogue Manga ─────────────────
router.get('/manga', async (req, res) => {
  try {
    const filters = {
      genre:     req.query.genre     || '',
      statut:    req.query.statut    || '',
      rating:    req.query.rating    || '',
      chapitres: req.query.chapitres || '',
    };

    const where = { type: 'MANGA' };

    if (filters.statut) {
      where.statut = filters.statut;
    }
    if (filters.rating) {
      where.note = { [Op.gte]: parseFloat(filters.rating) };
    }
    if (filters.chapitres) {
      const c = filters.chapitres;
      if (c === '50') where.nb_chapitres = { [Op.lt]: 50 };
      else if (c === '100') where.nb_chapitres = { [Op.between]: [50, 100] };
      else if (c === '101') where.nb_chapitres = { [Op.gte]: 101 };
    }

    // Genre filter (many-to-many)
    const include = [];
    if (filters.genre) {
      include.push({
        model: Genre,
        where: { libelle: filters.genre },
        through: { attributes: [] },
      });
    } else {
      include.push({
        model: Genre,
        through: { attributes: [] },
      });
    }

    const contenus = await Contenu.findAll({
      where,
      include: include.length > 0 ? include : undefined,
      order: [['note', 'DESC']],
    });

    const featured = contenus.length > 0
      ? contenus[Math.floor(Math.random() * contenus.length)]
      : null;

    // All genres for dropdown – use libelle
    const allGenres = await Genre.findAll({
      include: [{
        model: Contenu,
        where: { type: 'MANGA' },
        through: { attributes: [] },
      }],
      order: [['libelle', 'ASC']],
    });

    res.render('catalogue', {
      type: 'MANGA',
      contenus,
      featured,
      genres: allGenres,
      filters,
      user: getUser(req),
      page: 'manga',
    });
  } catch (error) {
    console.error('Erreur catalogue manga :', error);
    res.render('catalogue', {
      type: 'MANGA',
      contenus: [],
      featured: null,
      genres: [],
      filters: {},
      user: getUser(req),
      page: 'manga',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contenu = await Contenu.findByPk(req.params.id, {
      include: [{ model: Genre, through: { attributes: [] } }],
    });

    if (!contenu) return res.redirect('/');

    // Record visit if user is logged in
    if (req.session?.user) {
      await Historique.create({
        user_id: req.session.user.id,
        contenu_id: contenu.id,
        date_consultation: new Date()
      });
    }

    res.render('details', {
      contenu,
      user: req.session?.user || { username: 'TestUser' },
      page: ''
    });
  } catch (error) {
    console.error('Erreur details :', error);
    res.redirect('/');
  }
});

module.exports = router;