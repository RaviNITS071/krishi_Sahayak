const twilio = require('twilio');
const Farmer = require('../models/Farmer');
const Scheme = require('../models/Scheme');

exports.incomingCall = async (req, res) => {
  const name = decodeURIComponent(req.query.name || "किसान भाई");
  const phone = req.query.phone;

  const farmer = await Farmer.findOne({ phoneNo: phone });

  const schemes = await Scheme.find();

  const eligibleSchemes = schemes.filter(s => {
    const e = s.eligibility;

    return (
      farmer.annualIncome <= e.maxIncome &&
      (e.allowedCastes.includes("All") || e.allowedCastes.includes(farmer.caste)) &&
      (e.targetStates.includes("All") || e.targetStates.includes(farmer.location.state)) &&
      farmer.landArea >= e.minLand &&
      farmer.landArea <= e.maxLand
    );
  });

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    { voice: 'Polly.Aditi', language: 'hi-IN' },
    `${name} जी नमस्ते। मैं कृषी सहायक से बोल रही हूँ।`
  );

  twiml.pause({ length: 1 });

  if (eligibleSchemes.length === 0) {
    twiml.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      "इस समय आपके लिए कोई योजना उपलब्ध नहीं है। धन्यवाद।"
    );
  } else {
    twiml.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      "आपके लिए निम्नलिखित योजनाएं उपलब्ध हैं।"
    );

    eligibleSchemes.slice(0, 2).forEach(scheme => {
      twiml.pause({ length: 1 });

      twiml.say(
        { voice: 'Polly.Aditi', language: 'hi-IN' },
        `${scheme.name} योजना में आपको ${scheme.benefits} मिलेंगे।`
      );
    });

    twiml.gather({
      input: 'speech',
      action: `${process.env.NGROK_URL}/api/voice/process-speech`,
      method: 'POST',
      language: 'hi-IN',
      timeout: 5,
      speechTimeout: 'auto'
    });

    // fallback
    twiml.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      "हमें आपका उत्तर नहीं मिला। कृपया दोबारा प्रयास करें।"
    );

    twiml.redirect(
      `${process.env.NGROK_URL}/api/voice/incoming-call?phone=${phone}&name=${encodeURIComponent(name)}`
    );
  }

  res.type('text/xml');
  res.send(twiml.toString());
};

exports.processSpeech = (req, res) => {
  const speech = (req.body.SpeechResult || "").toLowerCase();

  const twiml = new twilio.twiml.VoiceResponse();

  if (speech.includes("haan") || speech.includes("yes")) {
    twiml.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      "बहुत बढ़िया। कृपया अपने नजदीकी CSC केंद्र पर जाकर आवेदन करें। धन्यवाद।"
    );
  } else {
    twiml.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      "ठीक है। आप बाद में भी आवेदन कर सकते हैं। धन्यवाद।"
    );
  }

  twiml.pause({ length: 2 });

  twiml.say(
    { voice: 'Polly.Aditi', language: 'hi-IN' },
    "कॉल समाप्त की जा रही है। धन्यवाद।"
  );

  res.type('text/xml');
  res.send(twiml.toString());
};