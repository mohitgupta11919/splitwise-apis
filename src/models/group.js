const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); 

const Group = sequelize.define('Group', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  users_list: { type: DataTypes.JSONB, allowNull: false }
}, {
  timestamps: true, 
});

module.exports = Group;
