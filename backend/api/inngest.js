module.exports.config = {
  runtime: "nodejs",
};

const { serve } = require("inngest/node");
const { inngest } = require("../inngest/client.js");
const { monthlyEmailFunction } = require("../inngest/monthlyEmailFunction.js");

module.exports = serve({
  client: inngest,
  functions: [monthlyEmailFunction],
});