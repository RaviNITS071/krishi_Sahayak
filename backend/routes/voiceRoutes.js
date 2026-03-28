const express = require('express');
const router = express.Router();

const {
  incomingCall,
  processSpeech
} = require('../controllers/voiceController');

// 🔊 Incoming call webhook
router.post('/incoming-call', incomingCall);

// 🎤 Speech processing
router.post('/process-speech', processSpeech);

module.exports = router;