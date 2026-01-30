const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");


exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await transporter.sendMail({
    from: `"OTP Service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP: ${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });

  res.json({
    message: "OTP sent successfully",
    otp
  });

}



exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "All fields required" });

  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord)
    return res.status(400).json({ message: "OTP expired or not found" });

  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

  if (!isMatch)
    return res.status(400).json({ message: "Invalid OTP" });

  await Otp.deleteMany({ email });

  res.json({ message: "OTP verified successfully" });
}