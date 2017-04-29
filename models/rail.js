var mongoose = require('mongoose');

var crack  = mongoose.Schema({
    tlat:{
        type:Number
    },
    tlong:{
        type:Number
    },
    clat:{
        type:Number
    },
    clong:{
        type:Number
    },
    flag:{
        type:Number
    },
    status:{
        type:Number
    },
    filename:{
        type:String
    }
});


var Crack = mongoose.model('Crack',crack);

exports.Crack = Crack;