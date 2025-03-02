const express = require('express');
const router = express.Router();
const ClickCount = require('../models/ClickCount');

// Increment Click Count
router.post('/click/:type', async (req, res) => {
    const { type } = req.params; // 'GPA' or 'CGPA'
    
    if (!['GPA', 'CGPA'].includes(type)) {
        return res.status(400).json({ message: 'Invalid type' });
    }

    try {
        const click = await ClickCount.findOneAndUpdate(
            { type },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        res.json({ message: `${type} button clicked`, totalClicks: click.count });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Click Counts
router.get('/clicks', async (req, res) => {
    try {
        const clicks = await ClickCount.find();
        res.json(clicks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
