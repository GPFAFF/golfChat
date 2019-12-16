const mongodb = require('mongodb')

const { connectionString, port } = require('./config');

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  module.exports = client
  const app = require('./server')
  app.listen(port)
})