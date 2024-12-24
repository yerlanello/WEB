const express = require('express');
const router = express.Router();
const path = require('path');

// Routes for HTML pages
router.get('/', (req, res) => {
    res.router(path.join(path.dirname(__dirname), 'public', 'home.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'register.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'dashboard.html'));
});

router.get('/transactions', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'transactions.html'));
});

router.get('/budgeting', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'budgeting.html'));
});

router.get('/reports', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'reports.html'));
});

router.get('/account', (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), 'public', 'account.html'));
});

module.exports = router;