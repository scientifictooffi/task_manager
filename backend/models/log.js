const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: String,
    userId: String,
    details: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);