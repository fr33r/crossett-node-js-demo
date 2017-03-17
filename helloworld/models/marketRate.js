var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marketRateSchema = new Schema({
    zipCode: String,
    rate: Number
});

module.exports = mongoose.model('MarketRate', marketRateSchema);
