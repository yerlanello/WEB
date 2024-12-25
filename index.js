const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/finance-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);


// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
