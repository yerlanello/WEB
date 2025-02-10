require("dotenv").config(); // Load environment variables

// Log to verify values from the .env file
console.log('PORT:', process.env.PORT);
console.log('MongoDB URI:', process.env.MongoDbCollection_CONNECTION_URL);
console.log('API URL:', process.env.API_URL);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const cookieParser = require("cookie-parser");
const path = require('path');

const MongoDbCollection_CONNECTION_URL = process.env.MongoDbCollection_CONNECTION_URL;
const PORT = process.env.PORT || 5000;  // Default to 5000 if PORT is not set
const API_URL = process.env.API_URL || `http://localhost:5000`; // Default to localhost if API_URL is not set

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cookieParser());
// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(MongoDbCollection_CONNECTION_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);

// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${API_URL}`);
});
