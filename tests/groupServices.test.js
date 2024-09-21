const GroupServices = require('../src/services/groupServices');
const Group = require('../src/models/group');
const User = require('../src/models/user');
const { Op } = require('sequelize');

jest.mock('../src/models/group');
jest.mock('../src/models/user'); 
describe('GroupServices', () => {
  describe('updateGroupUserList', () => {
    const mockGroup = {
      id: 1,
      users_list: [1, 2, 3],
      update: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update user list by adding and removing users', async () => {
      Group.findOne.mockResolvedValue(mockGroup);
      User.findAll.mockResolvedValue([{ id: 4 }, { id: 5 }]); // Users to add

      const result = await GroupServices.updateGroupUserList(1, [4, 5], [2]);

      expect(Group.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(User.findAll).toHaveBeenCalledWith({
        where: { id: { [Op.in]: [4, 5] } },
        attributes: ['id'],
        raw: true,
      });
      expect(mockGroup.update).toHaveBeenCalledWith({ users_list: [1, 3, 4, 5] });
      expect(result).toBe(true);
    });

    it('should handle when the group is not found', async () => {
      Group.findOne.mockResolvedValue(null);

      await expect(GroupServices.updateGroupUserList(999, [4], [2]))
        .rejects
        .toThrow('Group not found.');
    });

    it('should remove users from the list', async () => {
      Group.findOne.mockResolvedValue(mockGroup);
      User.findAll.mockResolvedValue([]); // No users to add

      const result = await GroupServices.updateGroupUserList(1, [], [2]);

      expect(mockGroup.update).toHaveBeenCalledWith({ users_list: [1, 3] });
      expect(result).toBe(true);
    });

    it('should handle when no users are added or removed', async () => {
      Group.findOne.mockResolvedValue(mockGroup);
      User.findAll.mockResolvedValue([]); // No users to add

      const result = await GroupServices.updateGroupUserList(1, [], []);

      expect(mockGroup.update).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if user retrieval fails', async () => {
      Group.findOne.mockResolvedValue(mockGroup);
      User.findAll.mockRejectedValue(new Error('Database error'));

      await expect(GroupServices.updateGroupUserList(1, [4], []))
        .rejects
        .toThrow('Database error');
    });
  });
});
