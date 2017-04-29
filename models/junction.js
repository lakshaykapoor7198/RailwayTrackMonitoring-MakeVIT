var mongoose = require('mongoose');

var junction  = mongoose.Schema({
    slat:Number,
    slong:Number,
    s1lat:Number,
    s1long:Number,
    s2lat:Number,
    s2long:Number,
    s3lat:Number,
    s3long:Number
});


var Junction = mongoose.model('Junction',junction);

exports.Junction = Junction;