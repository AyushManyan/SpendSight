const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

// register User

exports.registerUser = async (req, res) => {
    const { fullName, email, password,profileImageUrl } = req.body;

    // validation hcekt for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }
    console.log("Registering user with email:", email);
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // create new user
        const user = await User.create({ fullName, email, password, profileImageUrl });
        console.log("User registered:", user);
        // Remove password from user object before sending
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({
            id: user._id,
            user: userObj,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    // validation check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Remove password from user object before sending
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({
            id: user._id,
            user: userObj,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update User Info
exports.updateUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, email, profileImageUrl } = req.body;

        // Only allow updating certain fields
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (email) updateFields.email = email;
        if (profileImageUrl) updateFields.profileImageUrl = profileImageUrl;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Change User Password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};