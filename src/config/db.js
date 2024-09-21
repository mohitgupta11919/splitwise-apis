const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, 
});


const connectDB = async () => {
  try {
    await sequelize.sync(); 
    console.log('Database connected and synced.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
  } catch (error) {
    console.error('Error: ', error);
  }
};

module.exports = {
  sequelize,
  connectDB,
  authenticateDB,
};
