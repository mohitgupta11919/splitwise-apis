const ExpenseService = require('../src/services/expenseServices');
const Expense = require('../src/models/expense');
const Group = require('../src/models/group');
const Transaction = require('../src/models/transaction');
const { sequelize } = require('../src/config/db');
const { Op } = require('sequelize');

jest.mock('../src/models/expense'); 
jest.mock('../src/models/group'); 
jest.mock('../src/models/transaction'); 

describe('ExpenseService', () => {
  describe('addExpense', () => {
    const mockGroup = {
      id: 1,
      users_list: [1, 2, 3],
    };

    beforeEach(() => {
      jest.clearAllMocks();
      Group.findByPk.mockResolvedValue(mockGroup);
      sequelize.transaction = jest.fn().mockImplementation(async (callback) => {
        await callback({
          commit: jest.fn(),
          rollback: jest.fn(),
        });
      });
    });


    it('should throw an error if the group is not found', async () => {
      Group.findByPk.mockResolvedValue(null);
      
      const expenseData = {
        name: 'Dinner',
        description: 'Dinner with friends',
        group_id: 1,
        total_expense_amount: 100,
        splitType: 'equal',
        creator: 1,
        payer_id: 1,
      };

      await expect(ExpenseService.addExpense(expenseData)).rejects.toThrow('Group not found');
    });

    it('should throw an error if there are no users in the group', async () => {
      mockGroup.users_list = [];
      
      const expenseData = {
        name: 'Dinner',
        description: 'Dinner with friends',
        group_id: 1,
        total_expense_amount: 100,
        splitType: 'equal',
        creator: 1,
        payer_id: 1,
      };

      await expect(ExpenseService.addExpense(expenseData)).rejects.toThrow('No users in the group.');
    });

  });

  describe('updateExpense', () => {
    const mockExpense = {
      id: 1,
      group_id: 1,
      update: jest.fn(),
    };

    const mockGroup = {
        id: 1,
        users_list: [1, 2, 3],
      };
      
    beforeEach(() => {
      jest.clearAllMocks();
      Expense.findByPk.mockResolvedValue(mockExpense);
      Group.findByPk.mockResolvedValue(mockGroup);
    });

    it('should update the expense', async () => {
      const reqBody = { name: 'Updated Dinner' };
      await ExpenseService.updateExpense(1, reqBody);

      expect(mockExpense.update).toHaveBeenCalledWith(reqBody);
    });

    it('should throw an error if the expense is not found', async () => {
      Expense.findByPk.mockResolvedValue(null);

      await expect(ExpenseService.updateExpense(999, {})).rejects.toThrow('Expense not found.');
    });

    it('should throw an error if trying to change the group_id', async () => {
      const reqBody = { group_id: 2 };

      await expect(ExpenseService.updateExpense(1, reqBody)).rejects.toThrow('Group change is not allowed.');
    });

    it('should throw an error if the group is not found', async () => {
      Group.findByPk.mockResolvedValue(null);

      await expect(ExpenseService.updateExpense(1, {})).rejects.toThrow('Group not found.');
    });
  });

  describe('getExpensesByGroupId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      Expense.findAll.mockResolvedValue([]);
    });

    it('should fetch expenses by group_id', async () => {
      const reqBody = { group_id: 1 };
      const expenses = await ExpenseService.getExpensesByGroupId(reqBody);

      expect(Expense.findAll).toHaveBeenCalledWith({ where: { group_id: 1 } });
      expect(expenses).toEqual([]);
    });

    it('should apply date filters if provided', async () => {
      const reqBody = {
        group_id: 1,
        start_date: '2024-01-01',
        end_date: '2024-01-31',
      };

      const expenses = await ExpenseService.getExpensesByGroupId(reqBody);

      expect(Expense.findAll).toHaveBeenCalledWith({
        where: {
          group_id: 1,
          createdAt: {
            [Op.between]: [new Date('2024-01-01'), new Date('2024-01-31')],
          },
        },
      });
      expect(expenses).toEqual([]);
    });

    it('should throw an error for invalid date format', async () => {
      const reqBody = {
        group_id: 1,
        start_date: 'invalid-date',
        end_date: '2024-01-31',
      };

      await expect(ExpenseService.getExpensesByGroupId(reqBody)).rejects.toThrow('Invalid date format.');
    });
  });
});
