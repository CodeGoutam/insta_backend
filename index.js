require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./model');

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
// backend/index.js

app.use(express.json()); // ✅ Important
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.post('/api/login', (req, res) => {
    console.log('Content-Type:', req.headers['content-type']);
    console.log('REQ BODY RAW:', req.body); // Debug

    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    User.create({ username, password })
        .then(user => {
            res.status(201).json({ success: true, user });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err.message });
        });
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});
