require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECT
connectDB();

// ROUTES
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', schemeRoutes);
app.use('/api/voice', voiceRoutes);

// TEST ROUTE (IMPORTANT)
app.get('/', (req, res) => {
  res.send("Server is running 🚀");
});

// START SERVER (MOST IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});