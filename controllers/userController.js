const User = require('../models/User');

exports.loginUser = async function(req, res) {
  const user = new User(req.body);
  await user.login()
    .then((result) => {
      req.session.user = {
        username: user.data.username,
        isLoggedIn: true,
      }
      req.flash('success', 'Success!')
      req.session.save(() => {
        res.redirect('/');
      })
    })
    .catch((error) => {
      req.flash('errors', error)
      req.session.save(() => res.redirect('/'))
    })
}

exports.logoutUser = (req, res) => req.session.destroy(() => res.redirect('/'))

exports.registerUser = async function(req, res) {
  const newUser = new User(req.body);
  await newUser
    .register()
    .then(() => {
      req.session.user = {
        username: user.data.username
      }
      req.session.save(() => res.redirect('/'))
    })
    .catch(() => {
      newUser.errorList.map(error => {
        req.flash('registerErrors', error)
      })
      req.session.save(() => res.redirect('/'))
    })
}

exports.getDashboard = (req, res) => {
  if (req.session.user) {
    res.render('dashboard',
      { username: req.session.user.username,
        isLoggedIn: req.session.user.isLoggedIn,
      }
    )
  } else {
    res.render('index', 
      {errors: req.flash('errors'), registerErrors: req.flash('registerErrors')}
    );
  }
}