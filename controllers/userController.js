const User = require('../models/User');

exports.loginUser = async (req, res) => {
  const user = new User(req.body);
  await user.login()
    .then((result) => res.send(result))
    .catch((error) => res.send(error))
}

exports.logOut = () => {
  
}

exports.registerUser = (req, res) => {
  const newUser = new User(req.body);
  newUser.register();
  if (newUser.errorList.length) return res.render('error', { errors: newUser.errorList })
  res.render('success')
}

exports.getDashboard = (req, res) => res.render('index');