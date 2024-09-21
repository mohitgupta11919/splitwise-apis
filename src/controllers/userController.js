const User = require('../models/user');
const UserServices = require('../services/userServices')
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await UserServices.createUser({ name, email, phone })
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({message: "check entered details, not showing email/phone exists due to security concerns" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await UserServices.getUserById(req.params.id)
    res.status(200).json(user);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};
