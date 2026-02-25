// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'radiantroof_db',
    user: process.env.DB_USER || 'radiant_user',
    password: process.env.DB_PASSWORD || 'supersecurepassword',
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwtkey',
  }
};