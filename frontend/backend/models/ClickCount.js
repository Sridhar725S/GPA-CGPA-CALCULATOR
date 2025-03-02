const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    type: { type: String, enum: ['GPA', 'CGPA'], required: true },
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('ClickCount', clickSchema);
