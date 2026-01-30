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
      <div style="max-width:420px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);font-family:'Segoe UI',Arial,sans-serif;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="https://img.icons8.com/color/96/000000/lock--v2.png" alt="OTP" style="width:56px;height:56px;"/>
        </div>
        <h2 style="color:#222;font-size:1.5rem;text-align:center;margin-bottom:8px;">Verify your email address</h2>
        <p style="color:#555;text-align:center;margin-bottom:24px;">Use the code below to complete your sign in. This code is valid for <b>5 minutes</b>.</p>
        <div style="display:flex;justify-content:center;margin-bottom:24px;">
          <span style="font-size:2.2rem;letter-spacing:0.4rem;background:#f6f6f6;padding:12px 32px;border-radius:8px;color:#2d72d9;font-weight:600;box-shadow:0 2px 8px rgba(45,114,217,0.08);">${otp}</span>
        </div>
        <p style="color:#888;font-size:0.95rem;text-align:center;">If you did not request this code, you can safely ignore this email.</p>
        <div style="margin-top:32px;text-align:center;color:#bbb;font-size:0.85rem;">&mdash; The SpendSight Team</div>
      </div>
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