const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');  

const Transaction = sequelize.define('Transaction', {
  user_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  expense_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,   
    allowNull: false,
  },
  settled: {
    type: DataTypes.BOOLEAN,  
    defaultValue: false,    
  },
  settled_with_user: {
    type: DataTypes.INTEGER  
  },
}, {
  timestamps: true,  
});

module.exports = Transaction;
