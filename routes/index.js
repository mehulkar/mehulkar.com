/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Contact' });
};

exports.favorites = function(req, res){
  res.render('favorites', { title: 'Favorites' });
};