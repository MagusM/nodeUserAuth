var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthernticated, function(req, res, next) {
  res.render('index', { title: 'Members Area' });
});

function ensureAuthernticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;
