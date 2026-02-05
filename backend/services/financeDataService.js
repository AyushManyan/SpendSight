const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.fetchIncomeData = async (userId, tilldays = 30) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - tilldays);

  const matchUserId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const totalIncome = await Income.aggregate([
    { $match: { userId: matchUserId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const incomeByCategory = await Income.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate } } },
    { $group: { _id: "$source", totalAmount: { $sum: "$amount" } } },
  ]);

  return {
    totalIncome: totalIncome[0]?.total || 0,
    incomeByCategory,
  };
};

exports.fetchExpenseData = async (userId, tilldays = 30) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - tilldays);

  const matchUserId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const totalExpense = await Expense.aggregate([
    { $match: { userId: matchUserId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenseByCategory = await Expense.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate } } },
    { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
  ]);

  return {
    totalExpense: totalExpense[0]?.total || 0,
    expenseByCategory,
  };
};
