const Expense = require('../models/expense');
const Group = require('../models/group');
const Transaction = require('../models/transaction');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const { Observer, ConsoleLogger } = require('../observers/observer');
const HelperUtils = require("../utils/helper")

const { EqualSplitStrategy, ExactSplitStrategy } = require('../strategies/splitStrategy');

class ExpenseService {

  static observer = new Observer();

  static registerObserver(observer) {
    this.observer.addObserver(observer);
  }
  // Method to add a new expense
  static async addExpense({ name, description, group_id, total_expense_amount, splitType, creator, payer_id, exact_share = null }) {
    const group = await Group.findByPk(group_id);
    if (!group) {
      throw new Error('Group not found');
    }

    const users = group.users_list;
    if (!users || users.length === 0) {
      throw new Error('No users in the group.');
    }

    let splits;
    if (splitType === 'equal') {
      const splitStrategy = new EqualSplitStrategy();
      splits = splitStrategy.split(total_expense_amount, users);
    } else if (splitType === 'exact') {
      if (!exact_share) {
        throw new Error('Invalid exact share provided.');
      }
      const splitStrategy = new ExactSplitStrategy();
      splits = splitStrategy.split(total_expense_amount, users, exact_share);
    } else {
      throw new Error('Invalid split strategy.');
    }
    const transaction = await sequelize.transaction();

    try {
      // Create the expense
      const expense = await Expense.create({
        name,
        description,
        total_expense_amount,
        group_id,
        creator,
        splitType,
        payer_id,
      }, { transaction });

      // Log the splits
      console.log('Splits:', splits);

      // Create transactions based on the splits
      for (const [user_id, amount] of Object.entries(splits)) {
        const settle_with_user = user_id != payer_id ? payer_id : null;
        console.log(settle_with_user)

        await Transaction.create({
          group_id,
          user_id,
          expense_id: expense.id,
          amount,
          settled_with_user: settle_with_user,
        }, { transaction });

        this.observer.notify(`New transaction created: ${amount} for User ID: ${user_id}`);

      }

      await transaction.commit();

      return expense;
    }
    catch (e) {
      if (transaction) await transaction.rollback();
      throw e;
    }
  }




  // Method to update an expense
  static async updateExpense(id, reqBody) {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      throw new Error('Expense not found.');
    }

    // Prevent group_id from being updated
    if (reqBody.group_id) {
      throw new Error('Group change is not allowed.');
    }

    const group = await Group.findByPk(expense.group_id);
    if (!group) {
      throw new Error('Group not found.');
    }

    // Log users in the group
    console.log('Users in the group:', group.users_list);

    // Update the expense
    const updatedExpense = await expense.update(reqBody);

    return updatedExpense;
  }




  // Method to fetch expenses by group_id and optional date range
  static async getExpensesByGroupId(reqBody) {
    const { group_id, start_date, end_date } = reqBody;

    const conditions = { where: { group_id } };
    // Apply date filter if provided
    if (start_date && end_date) {
      const { start, end } = HelperUtils.validateDateRange(start_date, end_date)
      conditions.where.createdAt = {
        [Op.between]: [start, end],
      };
    }

    const expenses = await Expense.findAll(conditions);
    return expenses;
  }
}

module.exports = ExpenseService;
