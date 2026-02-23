// utils/validateAIResponse.js
exports.validateAIResponse = (aiResponse) => {
  if (!aiResponse || !aiResponse.intent) {
    throw new Error("Invalid AI response");
  }

  if (aiResponse.intent === "DIRECT_REPLY") {
    return aiResponse;
  }

  if (!["income", "expense", "both"].includes(aiResponse.target)) {
    throw new Error("Invalid target");
  }

  const allowedOps = ["$gte", "$lte"];

  const validateFilter = (filter) => {
    for (const key in filter) {
      if (typeof filter[key] === "object") {
        for (const op in filter[key]) {
          if (!allowedOps.includes(op)) {
            throw new Error("Unsafe Mongo operator detected");
          }
        }
      }
    }
  };

  validateFilter(aiResponse.incomeFilter || {});
  validateFilter(aiResponse.expenseFilter || {});

  return aiResponse;
};