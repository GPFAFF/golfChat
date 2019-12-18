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
    case 'usernameTaken':
      this.errorList.push('That username is taken.');
      break;
    case 'usernameTaken':
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

User.prototype.login = async function() {
  try {
    await this.sanitize();
    await usersCollection
      .db()
      .collection('golfers')
      .findOne(
        { username: this.data.username}
      )
      .then((checkUser) => {
        if (checkUser && isPasswordValid(this.data.password, checkUser.password)) {
          resolve('Congrats here')
        } else {
          reject('Invalid Username or Password.')
        }
      })
  } catch (error) {
      console.log('error')
  }
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

    // only if username is valid
    if (isAlphaNumeric(username) && username.length > 3 && username.length < 20) {
      const usernameExists = await 
        usersCollection
          .db()
          .collection('golfers')
          .findOne({
            username,
          });
        console.log(usernameExists);
        this.errors('usernameTaken')
    }
  
    if (isEmail(email)) {
      const emailExists = await 
        usersCollection
          .db()
          .collection('golfers')
          .findOne({
            email,
          });
      console.log(emailExists);

      if (emailExists) {
        this.errors('emailTaken')
      }
    }
  } catch(error) {
    console.log(error)
  }
}

User.prototype.register = async function() {
  try {
    await this.sanitize();
    await this.validate();
    
    if (!this.errorList.length) {
      this.data.password = hashPassword(this.data.password)
      await usersCollection
        .db()
        .collection('golfers')
        .insertOne(this.data)
    }
  } catch (errors) {
    console.log(errors);
    }
};

module.exports = User;