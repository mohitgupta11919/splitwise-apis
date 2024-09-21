const Group = require('../models/group');
const User = require('../models/user');
const { Op } = require('sequelize');


class GroupServices {
  static async updateGroupUserList(groupId, userIdsToAdd = [], userIdsToRemove = []) {
    const group = await this.findGroupById(groupId);
    const userList = group.users_list || [];

 
    const usersToAdd = await this.getValidUsersToAdd(userIdsToAdd, userList);
    const usersToRemove = this.getUsersToRemove(userList, userIdsToRemove);


    let updatedUserList = [...userList, ...usersToAdd];
    updatedUserList = this.removeUsers(updatedUserList, usersToRemove);


    if (usersToAdd.length > 0 || usersToRemove.length > 0) {
      await group.update({ users_list: updatedUserList });
      console.log("Group user list updated successfully.");
    }

    return true;
  }

  static async findGroupById(groupId) {
    const group = await Group.findOne({ where: { id: groupId } });
    if (!group) throw new Error("Group not found.");
    return group;
  }

  static async getValidUsersToAdd(userIdsToAdd, currentUserList) {
  
    const validUsers = await User.findAll({
      where: { id: { [Op.in]: userIdsToAdd } },
      attributes: ['id'],
      raw: true,
    });
    const validUserIds = validUsers.map(user => user.id);
    return validUserIds.filter(userId => !currentUserList.includes(userId));
  }

  static getUsersToRemove(currentUserList, userIdsToRemove) {
    return currentUserList.filter(userId => userIdsToRemove.includes(userId));
  }

  static removeUsers(currentUserList, usersToRemove) {
    return currentUserList.filter(userId => !usersToRemove.includes(userId));
  }
}

module.exports = GroupServices;
