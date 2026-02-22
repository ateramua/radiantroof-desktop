const sequelize = require('./src/models/index'); // correct relative path
const House = require('./src/models/House');    
const User = require('./src/models/User');      


sequelize.sync()
  .then(() => console.log('✅ Tables synced'))
  .catch(err => console.error('❌ Error syncing tables:', err));

//   node sync.js