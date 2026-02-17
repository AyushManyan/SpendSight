const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateFinanceQuery = async (userMessage) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  const today = new Date().toISOString();

  const prompt = `
You are a strict JSON API that converts finance questions into MongoDB filters.

RULES (VERY IMPORTANT):
- Output ONLY valid JSON
- No markdown, no explanation, no comments
- Never guess or infer date ranges
- Do NOT create date filters for words like:
  "around", "near", "early", "mid", "late"
- Only create a date filter if the user clearly specifies an exact date using words like:
  "on 5 feb", "on 12 january"
- Use only Mongo operators: $gt, $lt, $gte, $lte
- Never include userId
- If the query is not finance-related or unclear, return:
  {"error":"Query not related to finance"}

Income fields: source, amount, date
Expense fields: category, amount, date

Today (for reference only): ${today}

User query:
"${userMessage}"

Response format (MUST follow exactly):
{
  "target": "income" | "expense" | "both",
  "incomeFilter": {},
  "expenseFilter": {}
}
`;


  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
