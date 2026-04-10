// Vérifier si l'utilisateur est connecté
exports.isConnected = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Vérifier si l'utilisateur est adulte
exports.isAdulte = (req, res, next) => {
  if (req.session?.user?.statut === 'ADULTE') {
    return next();
  }
  res.redirect('/landing');
};