const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const clickRoutes = require('./routes/clickRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Click Tracking Routes
app.use('/api', clickRoutes);

// GPA Calculation API
app.post('/api/gpa', (req, res) => {
    const { courses } = req.body;
    const gradePoints = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0 };

    let totalCredits = 0;
    let weightedSum = 0;

    courses.forEach(course => {
        const gradePoint = gradePoints[course.grade.toUpperCase()] || 0;
        totalCredits += course.credits;
        weightedSum += gradePoint * course.credits;
    });

    const gpa = totalCredits ? weightedSum / totalCredits : 0;
    res.json({ gpa: gpa.toFixed(3) });
});

// CGPA Calculation API
app.post('/api/cgpa', (req, res) => {
    const { semesters } = req.body;

    let totalCredits = 0;
    let weightedSum = 0;

    semesters.forEach(sem => {
        totalCredits += sem.credits;
        weightedSum += sem.gpa * sem.credits;
    });

    const cgpa = totalCredits ? weightedSum / totalCredits : 0;
    res.json({ cgpa: cgpa.toFixed(3) });
});

// Serve Angular frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
