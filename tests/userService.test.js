const User = require('../src/models/user');
const UserServices = require('../src/services/userServices');
const { ValidationError } = require('sequelize');

// Mock the User model
jest.mock('../src/models/user');

describe('UserServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' };
      User.create.mockResolvedValue(mockUser);

      const result = await UserServices.createUser({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });
      
      expect(result).toEqual(mockUser);
      expect(User.create).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });
    });

    it('should throw an error if user creation fails', async () => {
      User.create.mockRejectedValue(new ValidationError('Validation error'));

      await expect(UserServices.createUser({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' }))
        .rejects.toThrow('Validation error');
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await UserServices.getUserById(1);
      
      expect(result).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(UserServices.getUserById(999))
        .rejects.toThrow({ message: 'User not found' });
    });
  });
});
