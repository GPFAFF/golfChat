const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();

const router = require('./router');

const sessionOptions = session({
  secret: 'golfChat',
  store: new MongoStore({
    client: require('./db')
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
})

app.use(sessionOptions);
app.use(flash())

app.set('views', 'views');
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

module.exports = app;