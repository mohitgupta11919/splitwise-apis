const TransactionServices = require('../src/services/transactionServices'); 
const Transaction = require('../src/models/transaction');
const { Op } = require('sequelize');

jest.mock('../src/models/transaction'); 

describe('TransactionServices', () => {
  describe('getBalanceBetweenUsers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the balance between two users', async () => {
      const mockTransactions = [
        { user_id: 1, settled_with_user: 2, amount: 100 },
        { user_id: 2, settled_with_user: 1, amount: 50 },
      ];
      Transaction.findAll.mockResolvedValue(mockTransactions);

      const balance = await TransactionServices.getBalanceBetweenUsers(1, 2);

      expect(balance).toBe(-50);
    });

    it('should return the balance of 0 if there are no transactions', async () => {
      Transaction.findAll.mockResolvedValue([]);

      const balance = await TransactionServices.getBalanceBetweenUsers(1, 2);

      expect(balance).toBe(0);
    });
  });

  describe('getBalanceBetweenUsersForGroup', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the balance between two users for a group', async () => {
      const mockTransactions = [
        { user_id: 1, settled_with_user: 2, amount: 100 },
        { user_id: 2, settled_with_user: 1, amount: 50 },
      ];
      Transaction.findAll.mockResolvedValue(mockTransactions);

      const balance = await TransactionServices.getBalanceBetweenUsersForGroup(1, 1, 2);

      expect(balance).toBe(-50); // User 1 owes 50 to User 2
    });

    it('should return the balance of 0 if there are no transactions for the group', async () => {
      Transaction.findAll.mockResolvedValue([]);

      const balance = await TransactionServices.getBalanceBetweenUsersForGroup(1, 1, 2);

      expect(balance).toBe(0);
    });
  });

  describe('getUserTransactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch transactions for a user', async () => {
      const mockTransactions = [
        { id: 1, user_id: 1, amount: 100 },
        { id: 2, user_id: 1, amount: 50 },
      ];
      Transaction.findAll.mockResolvedValue(mockTransactions);

      const transactions = await TransactionServices.getUserTransactions(1);

      expect(transactions).toEqual(mockTransactions);
      expect(Transaction.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });

    it('should apply date filters if provided', async () => {
      const mockTransactions = [
        { id: 1, user_id: 1, amount: 100 },
        { id: 2, user_id: 1, amount: 50 },
      ];
      Transaction.findAll.mockResolvedValue(mockTransactions);

      const transactions = await TransactionServices.getUserTransactions(1, '2024-01-01', '2024-01-31');

      expect(Transaction.findAll).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          createdAt: {
            [Op.between]: [new Date('2024-01-01'), new Date('2024-01-31')],
          },
        },
      });
      expect(transactions).toEqual(mockTransactions);
    });

    it('should throw an error for invalid date format', async () => {
      await expect(TransactionServices.getUserTransactions(1, 'invalid-date', '2024-01-31'))
        .rejects.toThrow('Invalid date format.');
    });
  });

  describe('settleUsersForGroup', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should settle transactions for users in a group', async () => {
      Transaction.update.mockResolvedValue([1]);

      const result = await TransactionServices.settleUsersForGroup(1, 1, 2);

      expect(Transaction.update).toHaveBeenCalledWith(
        { settled: true },
        {
          where: {
            group_id: 1,
            settled: false,
            [Op.or]: [
              { user_id: 1, settled_with_user: 2 },
              { user_id: 2, settled_with_user: 1 },
            ],
          },
        }
      );
      expect(result).toBe('balance settled');
    });
  });

  describe('settleUsers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should settle transactions between two users', async () => {
      Transaction.update.mockResolvedValue([1]);

      const result = await TransactionServices.settleUsers(1, 2);

      expect(Transaction.update).toHaveBeenCalledWith(
        { settled: true },
        {
          where: {
            settled: false,
            [Op.or]: [
              { user_id: 1, settled_with_user: 2 },
              { user_id: 2, settled_with_user: 1 },
            ],
          },
        }
      );
      expect(result).toBe('balance settled');
    });
  });
});
