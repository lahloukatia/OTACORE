const { Contenu, Genre } = require('../models/index');
const { Op }             = require('sequelize');
const sequelize          = require('../config/database');
const { QueryTypes }     = require('sequelize');

// ── Helper genres ────────────────────────────
async function getGenresContenu(contenuId) {
  const genres = await sequelize.query(
    `SELECT g.libelle FROM genres g
     JOIN contenus_genres cg ON g.id = cg.genre_id
     WHERE cg.contenu_id = ?`,
    { replacements: [contenuId], type: QueryTypes.SELECT }
  );
  return genres.map(g => g.libelle);
}

async function enrichirAvecGenres(liste) {
  return await Promise.all(liste.map(async item => {
    const plain  = item.toJSON ? item.toJSON() : item;
    plain.genres = await getGenresContenu(plain.id);
    return plain;
  }));
}

// ── Filtre mineur ────────────────────────────
function filtrerParAge(liste, user) {
  if (!user || user.statut === 'MINEUR') {
    return liste.filter(c => c.classification === 'TOUT_PUBLIC');
  }
  return liste;
}

// ── LANDING PAGE ─────────────────────────────
exports.getLanding = async (req, res) => {
  try {
    const user = req.session?.user || null;

    // Trending — top 10 animes par note
    const trendingRaw = await Contenu.findAll({
      where: { type: 'ANIME' },
      order: [['note', 'DESC']],
      limit: 10
    });
    let trending = await enrichirAvecGenres(trendingRaw);
    trending = filtrerParAge(trending, user);

    // Featured — random parmi trending
    const featured = trending.length > 0
      ? trending[Math.floor(Math.random() * Math.min(5, trending.length))]
      : null;

    // Top Manga — top 8 par note
    const topMangaRaw = await Contenu.findAll({
      where: { type: 'MANGA' },
      order: [['note', 'DESC']],
      limit: 8
    });
    let topManga = await enrichirAvecGenres(topMangaRaw);
    topManga = filtrerParAge(topManga, user);

    res.render('landing', {
      user, page: 'home',
      featured, trending, topManga
    });

  } catch (err) {
    console.error('ERREUR LANDING:', err.message);
    res.render('landing', {
      user: req.session?.user || null,
      page: 'home',
      featured: null,
      trending: [],
      topManga: []
    });
  }
};

// ── PAGE ANIME ───────────────────────────────
exports.pageAnime = async (req, res) => {
  try {
    const user = req.session?.user || null;
    const { genre, statut, rating, saisons } = req.query;
    const filters = {
      genre:   genre   || '',
      statut:  statut  || '',
      rating:  rating  || '',
      saisons: saisons || ''
    };

    // Construire where
    const where = { type: 'ANIME' };
    if (statut) where.statut = statut;
    if (rating) where.note   = { [Op.gte]: parseFloat(rating) };
    if (saisons) {
      if (saisons === '1') where.nb_saisons = 1;
      if (saisons === '2') where.nb_saisons = 2;
      if (saisons === '3') where.nb_saisons = { [Op.gte]: 3 };
    }

    let contenus = await Contenu.findAll({ where, order: [['note', 'DESC']] });

    // Filtre genre
    if (genre) {
      const ids = await sequelize.query(
        `SELECT cg.contenu_id FROM contenus_genres cg
         JOIN genres g ON g.id = cg.genre_id
         WHERE g.libelle = ?`,
        { replacements: [genre], type: QueryTypes.SELECT }
      );
      const contenuIds = ids.map(r => r.contenu_id);
      contenus = contenus.filter(c => contenuIds.includes(c.id));
    }

    contenus = filtrerParAge(contenus, user);
    contenus = await enrichirAvecGenres(contenus);

    // Featured random
    const featured = contenus.length > 0
      ? contenus[Math.floor(Math.random() * Math.min(5, contenus.length))]
      : null;

    // Genres pour filtres
    const genresRows = await sequelize.query(
      `SELECT DISTINCT g.libelle FROM genres g
       JOIN contenus_genres cg ON g.id = cg.genre_id
       JOIN contenus c ON c.id = cg.contenu_id
       WHERE c.type = 'ANIME'
       ORDER BY g.libelle`,
      { type: QueryTypes.SELECT }
    );
    const genres = genresRows.map(g => g.libelle);

    res.render('catalogue', {
      type: 'ANIME', contenus, featured,
      genres, filters, user, page: 'anime'
    });

  } catch (err) {
    console.error('ERREUR PAGE ANIME:', err.message);
    res.redirect('/landing');
  }
};

// ── PAGE MANGA ───────────────────────────────
exports.pageManga = async (req, res) => {
  try {
    const user = req.session?.user || null;
    const { genre, statut, rating, chapitres } = req.query;
    const filters = {
      genre:     genre     || '',
      statut:    statut    || '',
      rating:    rating    || '',
      chapitres: chapitres || ''
    };

    const where = { type: 'MANGA' };
    if (statut) where.statut = statut;
    if (rating) where.note   = { [Op.gte]: parseFloat(rating) };
    if (chapitres) {
      if (chapitres === '50')  where.nb_chapitres = { [Op.lt]: 50 };
      if (chapitres === '100') where.nb_chapitres = { [Op.between]: [50, 100] };
      if (chapitres === '101') where.nb_chapitres = { [Op.gt]: 100 };
    }

    let contenus = await Contenu.findAll({ where, order: [['note', 'DESC']] });

    if (genre) {
      const ids = await sequelize.query(
        `SELECT cg.contenu_id FROM contenus_genres cg
         JOIN genres g ON g.id = cg.genre_id
         WHERE g.libelle = ?`,
        { replacements: [genre], type: QueryTypes.SELECT }
      );
      const contenuIds = ids.map(r => r.contenu_id);
      contenus = contenus.filter(c => contenuIds.includes(c.id));
    }

    contenus = filtrerParAge(contenus, user);
    contenus = await enrichirAvecGenres(contenus);

    const featured = contenus.length > 0
      ? contenus[Math.floor(Math.random() * Math.min(5, contenus.length))]
      : null;

    const genresRows = await sequelize.query(
      `SELECT DISTINCT g.libelle FROM genres g
       JOIN contenus_genres cg ON g.id = cg.genre_id
       JOIN contenus c ON c.id = cg.contenu_id
       WHERE c.type = 'MANGA'
       ORDER BY g.libelle`,
      { type: QueryTypes.SELECT }
    );
    const genres = genresRows.map(g => g.libelle);

    res.render('catalogue', {
      type: 'MANGA', contenus, featured,
      genres, filters, user, page: 'manga'
    });

  } catch (err) {
    console.error('ERREUR PAGE MANGA:', err.message);
    res.redirect('/landing');
  }
};

// ── PAGE DETAILS ─────────────────────────────
exports.pageDetails = async (req, res) => {
  try {
    const id      = parseInt(req.params.id);
    const contenu = await Contenu.findByPk(id);

    if (!contenu) {
      console.log(`Contenu ${id} non trouvé`);
      return res.redirect('/landing');
    }

    const plain  = contenu.toJSON();
    plain.genres = await getGenresContenu(id);

    const user = req.session?.user || null;

    // Vérif accès adulte
    if (plain.classification === 'ADULTE') {
      if (!user || user.statut === 'MINEUR') {
        return res.redirect('/landing');
      }
    }
// Enregistrer historique — pas de doublons
if (user) {
  // Supprimer ancienne entrée si existe
  await sequelize.query(
    'DELETE FROM historique WHERE user_id = ? AND contenu_id = ?',
    { replacements: [user.id, id], type: QueryTypes.DELETE }
  );
  // Insérer nouvelle entrée (date fraîche)
  await sequelize.query(
    'INSERT INTO historique (user_id, contenu_id) VALUES (?, ?)',
    { replacements: [user.id, id], type: QueryTypes.INSERT }
  );
}
    res.render('details', { contenu: plain, user, page: '' });

  } catch (err) {
    console.error('ERREUR DETAILS:', err.message);
    res.redirect('/landing');
  }
};