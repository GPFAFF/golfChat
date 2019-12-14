const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const router = require('./router');

app.set('views', 'views');
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

module.exports = app;