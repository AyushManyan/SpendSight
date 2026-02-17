exports.financeIntentScore = function(message) {
  const text = message?.toLowerCase();
  let score = 0;

  const strong = [
    "income", "expense", "spent", "earned", "salary",
    "transaction", "payment", "bill", "purchase",
    "credit", "debit", "spend", "cost", "amount", "day", "date"
  ];

  const weak = [
    "how much", "total", "show", "list", "when",
    "today", "yesterday", "this month", "last month",
    "which", "on", "in"
  ];

  strong.forEach(k => text?.includes(k) && (score += 2));
  weak.forEach(k => text?.includes(k) && (score += 1));

  return score;
}
