const Farmer = require('../models/Farmer');
const otpStore = require('../utils/otpStore');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.login = async (req, res) => {
  const { phoneNo } = req.body;

  const farmer = await Farmer.findOne({ phoneNo });
  if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  otpStore[phoneNo] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  try {
    await client.messages.create({
      body: `OTP: ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phoneNo}`
    });
  } catch {}

  res.json({ success: true, farmerData: farmer });
};

exports.verifyOtp = (req, res) => {
  const { phoneNo, otp } = req.body;

  const record = otpStore[phoneNo];

  if (!record) return res.status(400).json({ success: false });
  if (Date.now() > record.expires) return res.status(400).json({ success: false });

  if (record.otp !== otp) return res.status(400).json({ success: false });

  delete otpStore[phoneNo];
  res.json({ success: true });
};