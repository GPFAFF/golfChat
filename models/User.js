const md5 = require('md5');
const usersCollection = require('../db');
const { 
  isEmail, 
  isAlphaNumeric, 
  trimString,
  hashPassword,
  isPasswordValid,
} = require('../helpers/utils');

const User = function(data) {
  this.data = data;
  this.errorList = [];
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
    case 'usernameTaken':
      this.errorList.push('That username is taken.');
      break;
    case 'emailTaken':
      this.errorList.push('That email is taken.');
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

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.sanitize();

    return usersCollection
      .db()
      .collection('golfers')
      .findOne(
        { username: this.data.username }
      )
      .then((checkUser) => {
        if (checkUser && isPasswordValid(this.data.password, checkUser.password)) {
          this.data = checkUser;
          this.getAvatar();
          resolve('success');
        } else {
          reject('Invalid Username or Password.')
        }
      })
      .catch(error => console.error(error))
  })
}

User.prototype.validate = async function() {
  try {
    const { username, email, password } = this.data;
    if (!isAlphaNumeric(username))
    this.errors('username');
    if (username.length < 3)
      this.errors('usernameLength')
    if (!isEmail(email))
      this.errors('email');
    if (!password) 
      this.errors('password');
    if (password.length < 6 && password.length < 18) this.errors('passwordLength');

    if (isAlphaNumeric(username) && username.length > 3 && username.length < 20) {
      const usernameExists = await 
        usersCollection
          .db()
          .collection('golfers')
          .findOne({
            username,
          });
        if (usernameExists)this.errors('usernameTaken');
    }
  
    if (isEmail(email)) {
      const emailExists = await 
        usersCollection
          .db()
          .collection('golfers')
          .findOne({
            email,
          });

      if (emailExists) this.errors('emailTaken');
    }
  } catch (error) {
    console.error('error', error)
  }
}

User.prototype.register = async function() {
  try {
    await this.sanitize();
    await this.validate();
    
    if (!this.errorList.length) {
      this.data.password = hashPassword(this.data.password)
      usersCollection
        .db()
        .collection('golfers')
        .insertOne(this.data)
        this.getAvatar()
    }
  } catch (errors) {
    console.error('error', error)
  }
};

User.prototype.getAvatar = function() {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

module.exports = User;