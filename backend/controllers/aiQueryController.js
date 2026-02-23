// controllers/aiFinanceController.js
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { generateFinanceQuery } = require("../services/geminiLLMService");
const { validateAIResponse } = require("../utils/validateAIResponse");

exports.aiFinanceQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    const aiRaw = await generateFinanceQuery(query);
    const aiResult = validateAIResponse(aiRaw);

    // 🟢 DIRECT REPLY (no DB)
    if (aiResult.intent === "DIRECT_REPLY") {
      return res.json({
        success: true,
        reply: aiResult.reply
      });
    }

    // 🟢 DB QUERY
    let income = [];
    let expense = [];

    if (aiResult.target !== "expense") {
      income = await Income.find({
        userId,
        ...aiResult.incomeFilter
      });
    }

    if (aiResult.target !== "income") {
      expense = await Expense.find({
        userId,
        ...aiResult.expenseFilter
      });
    }

    return res.json({
      success: true,
      income,
      expense
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};