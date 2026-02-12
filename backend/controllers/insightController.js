const {
  fetchIncomeData,
  fetchExpenseData,
} = require("../services/financeDataService");
const { reportInsight } = require("../services/reportInsight");

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    // Accept dateRange[start] and dateRange[end] as flat query params
    const start = req.query.start_date;
    const end = req.query.end_date;

    const incomeData = await fetchIncomeData(userId, start, end);
    const expenseData = await fetchExpenseData(userId, start, end);

    const insights = await reportInsight(
      incomeData,
      expenseData,
      start,
      end
    );

    res.status(200).json({ insight: insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
};
