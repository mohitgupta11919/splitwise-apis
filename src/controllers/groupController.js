const Group = require('../models/group');
const User = require('../models/user');
const { Op } = require('sequelize');
const GroupServices = require('../services/groupServices')

exports.createGroup = async (req, res) => {
  try {
      const { name, description, users_list } = req.body;
      const group = await Group.create({ name, description, users_list });
      res.status(201).json({ message: 'Group created', group });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


exports.getGroupById = async (req, res) => {
  try {
      const group = await Group.findByPk(req.params.id);
      if (group) {
        res.status(200).json(group);
    } else {
        res.status(404).json({ message: 'group not found' });
    }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


exports.getGroupsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const groups = await Group.findAll({
      where: {
        users_list: {
          [Op.contains]: [userId],
        },
      },
    });
      if (groups.length >0) {
        res.status(200).json(groups);
    } else {
        res.status(404).json({ message: 'group not found' });
    }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.updateGroupMembers = async (req, res) => {
  try {
    const reqBody = req.body
    console.log(reqBody)

     GroupServices.updateGroupUserList(reqBody.groupId, reqBody.userIdsToAdd, reqBody.userIdsToRemove)
     res.status(200).json({message: "updated successfully"})
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};