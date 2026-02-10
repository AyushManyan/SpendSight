const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reportInsight = async (incomeData, expenseData, startDate, endDate) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const incomeBreakdown = incomeData.incomeByCategory
      .map(i => `- ${i._id}: ₹${i.totalAmount}`)
      .join("\n");

    const expenseBreakdown = expenseData.expenseByCategory
      .map(e => `- ${e._id}: ₹${e.totalAmount}`)
      .join("\n");

    const prompt = `
You are an intelligent personal finance assistant.

Analyze the user's financial data from ${startDate.toDateString()} to ${endDate.toDateString()} and provide actionable insights.

FINANCIAL SUMMARY
- Total Income: ₹${incomeData.totalIncome}
- Total Expense: ₹${expenseData.totalExpense}
- Net Savings: ₹${incomeData.totalIncome - expenseData.totalExpense}

INCOME BY CATEGORY
${incomeBreakdown}

EXPENSE BY CATEGORY
${expenseBreakdown}

Provide insights in this structure:

1. Overall financial health (savings rate & stability)
2. Top income sources and observations
3. Top expense categories with cost-cutting suggestions
4. Risk or imbalance warnings (if any)
5. 3 personalized financial tips

Rules:
- Use bullet points
- Be concise and practical
- Do not assume missing data
- Currency is INR (₹)
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini insight error:", error);
    throw new Error("Failed to generate insights");
  }
};
