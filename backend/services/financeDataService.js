const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.fetchIncomeData = async (userId, startDate, endDate) => {
  const fromDate = new Date(startDate);
  const toDate = new Date(endDate);

  const matchUserId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const totalIncome = await Income.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate, $lte: toDate } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const incomeByCategory = await Income.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate, $lte: toDate } } },
    { $group: { _id: "$source", totalAmount: { $sum: "$amount" } } },
  ]);

  return {
    totalIncome: totalIncome[0]?.total || 0,
    incomeByCategory,
  };
};

exports.fetchExpenseData = async (userId, startDate, endDate) => {
  const fromDate = new Date(startDate);
  const toDate = new Date(endDate);

  const matchUserId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const totalExpense = await Expense.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate, $lte: toDate } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenseByCategory = await Expense.aggregate([
    { $match: { userId: matchUserId, date: { $gte: fromDate, $lte: toDate } } },
    { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
  ]);

  return {
    totalExpense: totalExpense[0]?.total || 0,
    expenseByCategory,
  };
};
