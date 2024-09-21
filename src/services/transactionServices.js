const Transaction = require("../models/transaction")
const { Op } = require('sequelize');

class TransactionServices {
    static async getBalanceBetweenUsers(from_user, to_user) {
        const transactions = await Transaction.findAll({
            where: {
                settled: false,
                [Op.or]: [
                    { user_id: from_user, settled_with_user: to_user },
                    { user_id: to_user, settled_with_user: from_user }
                ]
            }
        });

        let totalBalance = 0;

        for (const transaction of transactions) {
            if (transaction.user_id == from_user) {
                totalBalance -= transaction.amount;  // User 1's perspective
                console.log(totalBalance)
            } else {
                totalBalance += transaction.amount;  // User 2's perspective
            }
        }

        return totalBalance;
    };

    static async getBalanceBetweenUsersForGroup(group_id, from_user, to_user) {
        const transactions = await Transaction.findAll({
            where: {
                group_id: group_id,
                settled: false,
                [Op.or]: [
                    { user_id: from_user, settled_with_user: to_user },
                    { user_id: to_user, settled_with_user: from_user }
                ]
            }
        });

        let totalBalance = 0;

        for (const transaction of transactions) {
            if (transaction.user_id == from_user) {
                totalBalance -= transaction.amount;  // User 1's perspective
                console.log(totalBalance)
            } else {
                totalBalance += transaction.amount;  // User 2's perspective
            }
        }

        return totalBalance;
    };


    static async getUserTransactions(userId, startDate, endDate){
        {
            const conditions = {
              where: {
                user_id: userId,
              }
            };
          
            // Add the date range filter if startDate and endDate are provided
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
          
              // Validate date range
              if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error('Invalid date format.');
              }
          
              conditions.where.createdAt = {
                [Op.between]: [start, end],
              };
            }
          
            // Fetch transactions based on the conditions
            const transactions = await Transaction.findAll(conditions);
            return transactions;
          };
    }

    static async settleUsersForGroup(group_id, from_user, to_user){
        await Transaction.update(
            { settled: true },  // Set settled to true
            {
              where: {
                group_id: group_id,
                settled: false,
                [Op.or]: [
                  { user_id: from_user, settled_with_user: to_user },
                  { user_id: to_user, settled_with_user: from_user }
                ]
              }
            }
          );
        return "balance settled"
    }

    static async settleUsers(from_user, to_user){
        await Transaction.update(
            { settled: true },  // Set settled to true
            {
              where: {
                settled: false,
                [Op.or]: [
                  { user_id: from_user, settled_with_user: to_user },
                  { user_id: to_user, settled_with_user: from_user }
                ]
              }
            }
          );
        return "balance settled"
    }
}

module.exports = TransactionServices