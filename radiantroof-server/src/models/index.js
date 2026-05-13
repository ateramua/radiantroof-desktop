const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const dbDialect = process.env.DB_DIALECT || 'sqlite';
const isSqlite = dbDialect === 'sqlite';

const sequelizeConfig = isSqlite
  ? {
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || path.join(__dirname, '../../radiantroof-server.sqlite'),
      logging: console.log
    }
  : {
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'radiantroof_db',
      username: process.env.DB_USER || 'radiant_user',
      password: process.env.DB_PASSWORD || 'supersecurepassword',
      logging: console.log,
      dialectOptions: process.env.NODE_ENV === 'production'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {}
    };

const sequelize = new Sequelize(sequelizeConfig);

sequelize
  .authenticate()
  .then(async () => {
    console.log('✅ Database connection established successfully.');
    if (isSqlite) {
      await sequelize.sync();
      console.log('✅ SQLite schema synced successfully.');
    }
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
    console.error('   This is OK for development. The server will continue running.');
  });

const Property = require('./Property')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes, {
  tableName: 'Users'
});

const db = {
  sequelize,
  Sequelize,
  Property,
  User,
};

module.exports = db;
