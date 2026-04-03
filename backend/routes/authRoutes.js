const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    registerUser,
    loginUser,
    getUserInfo,
    updateUserInfo,
    changePassword
} = require("../controllers/authController");
const router = express.Router();

// Route for user registration
router.post("/register", registerUser);
// Route for user login
router.post("/login", loginUser);

// Route for getting user profile
router.get("/getUser", protect, getUserInfo);


// Route for updating user profile
router.put("/update", protect, updateUserInfo);

// Route for changing user password
router.put("/change-password", protect, changePassword);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;