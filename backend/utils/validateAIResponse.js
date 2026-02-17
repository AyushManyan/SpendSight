
const { z } = require("zod");

const QuerySchema = z.object({
  target: z.enum(["income", "expense", "both"]),
  incomeFilter: z.object({}).passthrough(),
  expenseFilter: z.object({}).passthrough()
});

exports.validateAIResponse = function(data) {
  if (data.error) {
    throw new Error(data.error);
  }

  const parsed = QuerySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid AI response structure");
  }

  return parsed.data;
}
