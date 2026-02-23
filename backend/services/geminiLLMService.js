// services/geminiLLMService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildFinancePrompt } = require("../prompts/financePrompt");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateFinanceQuery = async (userMessage) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  const prompt = buildFinancePrompt(
    userMessage,
    new Date().toISOString()
  );

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};