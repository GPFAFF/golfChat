const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const isPasswordValid = (enteredPassword, hashedPassword) => bcrypt.compareSync(enteredPassword, hashedPassword)

const isAlphaNumeric = (expr) => {
  const alphaExpression = /^([a-zA-Z0-9 _-]+)$/;
  return alphaExpression.test(expr);
};

const isEmail = (expr) => {
  const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailExpression.test(expr);
}

const trimString = (expr) => {
  const stringExpression = /\s+/g;
  return expr.replace(stringExpression, '').toLowerCase();
}

module.exports = {
  isAlphaNumeric,
  isEmail,
  trimString,
  hashPassword,
  isPasswordValid
}