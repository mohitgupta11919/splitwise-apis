const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');  // Import the Sequelize instance

const Expense = sequelize.define('Expense', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_expense_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creator: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  splitType:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  payer_id: {
    type: DataTypes.JSONB,  
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Expense;
