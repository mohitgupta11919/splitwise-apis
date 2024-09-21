const User = require("../models/user")
const { Op } = require('sequelize');

class UserServices {
  static async createUser({ name, email, phone }) {
    const user = await User.create({ name, email, phone });
    return user
  }

  static async getUserById(id) {
    const user = await User.findByPk(id);
    if (user) {
     return user
    } else {
      throw new Error( 'User not found' );
    }
  }
}

module.exports = UserServices;