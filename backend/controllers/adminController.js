const Farmer = require('../models/Farmer');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.getKeypadFarmers = async (req, res) => {
  const farmers = await Farmer.find({ deviceType: 'keypad' });
  res.json({ success: true, farmers });
};

exports.triggerCall = async (req, res) => {
  const { farmerPhone, farmerName } = req.body;

  try {
    await client.calls.create({
      url: `${process.env.NGROK_URL}/api/voice/incoming-call?phone=${farmerPhone}&name=${encodeURIComponent(farmerName)}`,
      to: `+91${farmerPhone}`,
      from: process.env.TWILIO_PHONE
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};