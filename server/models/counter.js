var mongoose = require('mongoose');

var counterSchema = mongoose.Schema({
    for : {
        type : String,
        required : true
    },
    seq : {
        type : Number,
        default : 0
    }
});

var Counter = mongoose.model('counter',counterSchema);
module.exports = Counter;