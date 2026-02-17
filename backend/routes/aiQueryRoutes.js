const express = require("express");
const { aiFinanceQuery } = require("../controllers/aiQueryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, aiFinanceQuery);

module.exports = router;
