;

exports.login = function(req, res){
  if(req.user){
    res.redirect('/admin');
  }
  else{
    res.render('site/login');
  }
};
