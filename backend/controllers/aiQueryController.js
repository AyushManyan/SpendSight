const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { financeIntentScore } = require("../utils/financeIntent");
const { generateFinanceQuery } = require("../services/geminiLLMService");
const { validateAIResponse } = require("../utils/validateAIResponse");
const { getSmartDateRange } = require("../utils/dateParser");

exports.aiFinanceQuery = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id;

        //  Intent Guard
        if (financeIntentScore(query) < 2) {
            return res.status(400).json({
                error: "Only finance-related queries are allowed"
            });
        }

        //  AI Intent (NOT date logic)
        const aiRawResponse = await generateFinanceQuery(query);
        const aiQuery = validateAIResponse(aiRawResponse);

        //  Backend Date Handling (CRITICAL)

        const range = getSmartDateRange(query);

        if (range) {
            if (aiQuery.target !== "expense") {
                aiQuery.incomeFilter.date = {
                    $gte: range.start,
                    $lte: range.end
                };
            }

            if (aiQuery.target !== "income") {
                aiQuery.expenseFilter.date = {
                    $gte: range.start,
                    $lte: range.end
                };
            }
        }

        //  Salary source normalization
        if (aiQuery.target === "income") {
            aiQuery.incomeFilter.source = { $regex: /salary/i };
        }

        //  Execute Mongo Queries
        const incomeData =
            aiQuery.target !== "expense"
                ? await Income.find({ userId, ...aiQuery.incomeFilter })
                : [];

        const expenseData =
            aiQuery.target !== "income"
                ? await Expense.find({ userId, ...aiQuery.expenseFilter })
                : [];

        //  Empty result handling
        if (!incomeData.length && !expenseData.length) {
            return res.json({
                success: true,
                target: aiQuery.target,
                message: "No records found near the specified date.",
                income: [],
                expense: []
            });
        }

        return res.json({
            success: true,
            target: aiQuery.target,
            income: incomeData,
            expense: expenseData
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};
