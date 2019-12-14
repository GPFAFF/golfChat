const { 
  isEmail, 
  isAlphaNumeric, 
  trimString,
  hashPassword,
  isPasswordValid,
} = require('../helpers/utils');

const usersCollection = require('../db');

const User = function(data) {
  this.data = data;
  this.errorList = [];
  this.success = [];
}

User.prototype.errors = function(error) {

  switch (error) {
    case 'username':
      this.errorList.push('You must have a valid username without special characters.');
      break;
    case 'usernameLength':
      this.errorList.push('You must have a username longer than 3 characters.');
      break;
    case 'email':
      this.errorList.push('You must have a valid email.');
      break;
    case 'password':
      this.errorList.push('You must have a password.');
      break;
    case 'passwordLength':
      this.errorList.push('You must have a password between 6 and 18 characters.');
      break;
    default:
      this.success.push('Thanks for signing up');
   return this.errorList || this.success;
  }  
}

User.prototype.sanitize = function() {

  if (typeof(this.data.username) != "string") {this.data.username = ""}
  if (typeof(this.data.email) != "string") {this.data.email = ""}
  if (typeof(this.data.password) != "string") {this.data.password = ""}

  // get rid of any bogus properties
  this.data = {
    username: trimString(this.data.username),
    email: trimString(this.data.email),
    password: this.data.password
  }
}

User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    this.sanitize();
    usersCollection
      .collection('golfers')
      .findOne(
        { username: this.data.username}
      )
      .then((checkUser) => {
        if (checkUser && isPasswordValid(this.data.password, checkUser.password)) {
          resolve('Congrats here')
        } else {
          reject('errrrr')
        }
      })
      .catch(() => {
        reject("Please try again.")
      })
  })
}

User.prototype.validate = function() {
    const { username, email, password } = this.data;

    if (!isAlphaNumeric(username))
      this.errors('username');
    if (username.length < 3)
      this.errors('usernameLength')
    if (!isEmail(email))
      this.errors('email');
    if (!password) 
      this.errors('password');
    if (password.length < 6 && password.length < 18) { this.errors('passwordLength');
  }
}

User.prototype.register = function() { 
  this.sanitize(this.data);
  this.validate();

  if (!this.errorList.length) {
    this.data.password = hashPassword(this.data.password)
    console.log(this.data.password);
    usersCollection
      .collection('golfers')
      .insertOne(this.data)
  }
};

module.exports = User;