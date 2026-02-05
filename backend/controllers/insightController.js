const {
  fetchIncomeData,
  fetchExpenseData,
} = require("../services/financeDataService");
const { reportInsight } = require("../services/reportInsight");

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const tilldays = Number(req.query.tilldays) || 30;

    const incomeData = await fetchIncomeData(userId, tilldays);
    const expenseData = await fetchExpenseData(userId, tilldays);

    const insights = await reportInsight(
      incomeData,
      expenseData,
      tilldays
    );

    res.status(200).json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};
