const TransactionServices = require("../services/transactionServices")

exports.getBalanceBetweenUsers = async (req, res) => {
    try {
        const { from_user, to_user } = req.query;
        const balance = await TransactionServices.getBalanceBetweenUsers(from_user, to_user)
        res.json(balance);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving balance information", error: error.message });
    }
};


exports.getBalanceBetweenUsersforGroup = async (req, res) => {
    try {
        const { group_id, from_user, to_user } = req.query;
        const balance = await TransactionServices.getBalanceBetweenUsersForGroup(group_id, from_user, to_user)
        res.json(balance);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving balance information", error: error.message });
    }
};

exports.getUsersTransactions = async (req, res) => {
    try {
        const { user_id, start_date, end_date } = req.query;
        const txn = await TransactionServices.getUserTransactions(user_id, start_date, end_date)
        res.json(txn);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving information", error: error.message });
    }
};

exports.settleBalance = async (req, res) => {
    try {
        const { from_user, to_user } = req.body;
        await TransactionServices.settleUsers(from_user, to_user)
        res.json({ message: "Balance settled successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error settling the balance", error: error.message });
    }
};

exports.settleGroupBalance = async (req, res) => {
    try {
        const { group_id,from_user, to_user } = req.body;
        await TransactionServices.settleUsersForGroup(group_id,from_user, to_user)
        res.json({ message: "Balance settled successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error settling the balance", error: error.message });
    }
};