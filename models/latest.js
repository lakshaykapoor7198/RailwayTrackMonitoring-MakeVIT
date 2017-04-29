var mongoose = require('mongoose');

var latest  = mongoose.Schema({
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
    filename:{
        type:String 
    }
});


var Latest = mongoose.model('Latest',latest);

exports.Latest = Latest;