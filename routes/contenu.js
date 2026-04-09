const express = require('express');
const router  = express.Router();

// Données mock — remplacées par BDD plus tard
const mockAnimes = [
  {
    id: 1, titre: 'Demon Slayer', type: 'ANIME',
    image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
    synopsis: 'Tanjiro devient chasseur de démons pour sauver sa sœur transformée en démon.',
    auteur: 'Koyoharu Gotouge', note: 4.8, date_sortie: '2019',
    statut: 'EN_COURS', nb_saisons: 4, duree_episode: 23,
    age_recommande: 13, genres: ['Action', 'Fantasy', 'Drama'],
    trailer_url: 'https://www.youtube.com/watch?v=VQGCKyvzIM4'
  },
  {
    id: 2, titre: 'Jujutsu Kaisen', type: 'ANIME',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    synopsis: 'Yuji Itadori avale un doigt maudit et devient hôte d\'un démon puissant.',
    auteur: 'Gege Akutami', note: 4.7, date_sortie: '2020',
    statut: 'EN_COURS', nb_saisons: 2, duree_episode: 24,
    age_recommande: 16, genres: ['Action', 'Horror', 'Supernatural'],
    trailer_url: null
  },
  {
    id: 3, titre: 'Attack on Titan', type: 'ANIME',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    synopsis: 'L\'humanité survit derrière des murs géants pour se protéger des Titans.',
    auteur: 'Hajime Isayama', note: 5.0, date_sortie: '2013',
    statut: 'TERMINE', nb_saisons: 4, duree_episode: 24,
    age_recommande: 16, genres: ['Action', 'Drama', 'Mystery'],
    trailer_url: null
  },
];

const mockMangas = [
  {
    id: 10, titre: 'Vinland Saga', type: 'MANGA',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    synopsis: 'Thorfinn cherche à venger son père dans la Scandinavie médiévale.',
    auteur: 'Makoto Yukimura', note: 4.9, date_sortie: '2005',
    statut: 'EN_COURS', nb_chapitres: 200,
    age_recommande: 16, genres: ['Action', 'Historical', 'Drama'],
    trailer_url: null
  },
  {
    id: 11, titre: 'One Piece', type: 'MANGA',
    image_url: 'https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=400&q=80',
    synopsis: 'Monkey D. Luffy cherche le légendaire trésor One Piece.',
    auteur: 'Eiichiro Oda', note: 4.9, date_sortie: '1997',
    statut: 'EN_COURS', nb_chapitres: 1100,
    age_recommande: 10, genres: ['Action', 'Adventure', 'Comedy'],
    trailer_url: null
  },
];

// ── Helpers filtres ──────────────────────────
function applyFilters(list, filters) {
  return list.filter(item => {
    if (filters.genre  && !item.genres.includes(filters.genre)) return false;
    if (filters.statut && item.statut !== filters.statut) return false;
    if (filters.rating && item.note < parseFloat(filters.rating)) return false;

    if (filters.saisons && item.nb_saisons !== undefined) {
      if (filters.saisons === '3' && item.nb_saisons < 3) return false;
      if (filters.saisons === '2' && item.nb_saisons !== 2) return false;
      if (filters.saisons === '1' && item.nb_saisons !== 1) return false;
    }

    if (filters.chapitres && item.nb_chapitres !== undefined) {
      if (filters.chapitres === '50'  && item.nb_chapitres >= 50) return false;
      if (filters.chapitres === '100' && (item.nb_chapitres < 50 || item.nb_chapitres > 100)) return false;
      if (filters.chapitres === '101' && item.nb_chapitres <= 100) return false;
    }

    return true;
  });
}

// ── Fonction utilitaire user ─────────────────
function getUser(req) {
  return req.session?.user || { username: 'TestUser' };
}

// ── Page Anime ───────────────────────────────
router.get('/anime', (req, res) => {
  const filters = {
    genre:   req.query.genre   || '',
    statut:  req.query.statut  || '',
    rating:  req.query.rating  || '',
    saisons: req.query.saisons || '',
  };

  const contenus = applyFilters(mockAnimes, filters);
  const featured = mockAnimes[Math.floor(Math.random() * mockAnimes.length)];
  const genres   = [...new Set(mockAnimes.flatMap(a => a.genres))];

  res.render('catalogue', {
    type: 'ANIME',
    contenus,
    featured,
    genres,
    filters,
    user: getUser(req),
    page: 'anime'
  });
});

// ── Page Manga ───────────────────────────────
router.get('/manga', (req, res) => {
  const filters = {
    genre:     req.query.genre     || '',
    statut:    req.query.statut    || '',
    rating:    req.query.rating    || '',
    chapitres: req.query.chapitres || '',
  };

  const contenus = applyFilters(mockMangas, filters);
  const featured = mockMangas[Math.floor(Math.random() * mockMangas.length)];
  const genres   = [...new Set(mockMangas.flatMap(m => m.genres))];

  res.render('catalogue', {
    type: 'MANGA',
    contenus,
    featured,
    genres,
    filters,
    user: getUser(req),
    page: 'manga'
  });
});

// ── Page Details ─────────────────────────────
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const contenu = [...mockAnimes, ...mockMangas]
    .find(c => c.id === id);

  if (!contenu) return res.redirect('/');

  res.render('details', {
    contenu,
    user: getUser(req),
    page: ''
  });
});

module.exports = router;