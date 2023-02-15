const mongoose = require('mongoose');
const product = require('./Product');
const cacheSchema = new mongoose.Schema({
    data : [],
    timestamp : Date
});

module.exports = mongoose.model('Cache', cacheSchema);