const express = require("express");
const path = require("path");
const { serve } = require("inngest/express");
const { inngest } = require("./inngest/client.js");
const { monthlyEmailFunction } = require("./inngest/monthlyEmailFunction.js");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const billRoutes = require("./routes/billRoutes.js");
const otpRoutes = require("./routes/otpRoutes.js");
const insightRoutes = require("./routes/insightRoutes.js");
const aiQueryRoute = require("./routes/aiQueryRoutes.js");
const cors = require("cors");
const app = express();
app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT || 5000;

connectDB();

// middleware to handle cors issues
app.use(cors({
    origin: "*" || process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [monthlyEmailFunction],
  })
);

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/bill", billRoutes);

app.use("/api/v1/opt",otpRoutes);
app.use("/api/v1/insight", insightRoutes);
app.use("/api/v1/chat",aiQueryRoute );

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;