const Income = require("../models/Income");
const Expense = require("../models/Expense");
const {isvValidObjectId,Types} = require("mongoose");
const { isValidObjectId } = require("mongoose");

// @desc    Get dashboard data

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // fecth total income and total expense using aggregation

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);


        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);


        // get income transactions in the last 60 days

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });


        // get total income in 60 days
        const totalIncomeIn60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);


        // get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        // get total expense in 30 days
        const totalExpenseIn30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // fetch recent 5 income and expense transactions
        const lastTransactions =[
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({...txn.toObject(), type: 'income'})),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({...txn.toObject(), type: 'expense'}))
        ].sort((a, b) => b.date - a.date);  // sort last transactions by date

        

        // final response
        res.status(200).json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            
            last30DaysExpenses:{
                total: totalExpenseIn30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncomes:{
                total: totalIncomeIn60Days,
                transactions: last60DaysIncomeTransactions
            },
            recentTransactions: lastTransactions
        });
    }catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getDashboardData };
        
