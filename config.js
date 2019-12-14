const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT,
};