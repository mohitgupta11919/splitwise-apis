
const expenseService = require('../services/expenseServices');

class ExpenseController {
  async addExpense(req, res) {
    try{
    const { name, description,total_expense_amount, group_id, creator,splitType, payer_id, exact_share } = req.body;
    const expense = await expenseService.addExpense({ name, description, group_id, total_expense_amount, splitType, creator, payer_id, exact_share});
    res.json(expense);}
    catch(e){
      console.log(`Error Trace:: Expense Controller ${e.message}`)
      res.status(500).json({error: "something went wrong"})
    }
  }


  async updateExpense(req, res) {
    try{
    const reqBody =req.body;
    const expense = await expenseService.updateExpense(req.params.id, reqBody);
    res.json(expense);}
    catch(e){
      console.log(`Error Trace:: Expense Controller ${e.message}`)
      res.status(500).json({error: "something went wrong"})
    }
  }

  async getAllExpenseGroup(req, res) {
    try{
    const reqQuery =req.query;
    const expense = await expenseService.getExpensesByGroupId(reqQuery);
    res.json(expense);}
    catch(e){
      console.log(`Error Trace:: Expense Controller ${e.message}`)
      res.status(500).json({error: e.message})
    }
  }

}

module.exports = new ExpenseController();
