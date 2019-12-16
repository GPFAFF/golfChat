const User = require('../models/User');

exports.loginUser = (req, res) => {
  const user = new User(req.body);
  return user.login()
    .then((result) => {
      req.session.user = {
        username: user.data.username,
        isLoggedIn: true
      }
      req.session.save(() => res.redirect('/'))
    })
    .catch((error) => res.send(error))
}

exports.logoutUser = (req, res) => req.session.destroy(() => res.redirect('/'))

exports.registerUser = (req, res) => {
  const newUser = new User(req.body);
  newUser.register();
  if (newUser.errorList.length) return res.render('error', { errors: newUser.errorList })
  res.render('success')
}

exports.getDashboard = (req, res) => {
  if (req.session.user) {
    res.render('dashboard',{username: req.session.user.username,
    isLoggedIn: req.session.user.isLoggedIn})
  } else {
    res.render('index');
  }
}