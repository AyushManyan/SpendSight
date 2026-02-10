const {
  fetchIncomeData,
  fetchExpenseData,
} = require("../services/financeDataService");
const { reportInsight } = require("../services/reportInsight");

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    // Accept dateRange[start] and dateRange[end] as flat query params
    const start = req.query['dateRange[start]'];
    const end = req.query['dateRange[end]'];
    const startDate = start ? new Date(start) : new Date();
    const endDate = end ? new Date(end) : new Date();

    const incomeData = await fetchIncomeData(userId, startDate, endDate);
    const expenseData = await fetchExpenseData(userId, startDate, endDate);

    const insights = await reportInsight(
      incomeData,
      expenseData,
      startDate,
      endDate
    );

    res.status(200).json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};
