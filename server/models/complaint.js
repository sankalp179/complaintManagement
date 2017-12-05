var mongoose = require('mongoose');

var counter = require('../models/counter'); //counter model


var complaintSchema = new mongoose.Schema({
    complaintNumber: {
        type: Number
    },
    complaintType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    relevantParaClause: {
        type: String,
        required: true
    },
    objectionOrSuggestion: {
        type: String,
        enum: ['Complaint', 'Suggestion'],
        default: 'Complaint'
    },
    complaintDesc: {
        type: String,
        required: true,
        trim: true
    },
    complainant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    postedOn :{
        type : Date,
        default : Date.now()
    },
    official: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        enum: ['Posted', 'Under Consideration', 'Replied'],
        default: 'Posted'
    },
    actionTrail: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        action: {
            type: String,
            required: true
        },
        datetime: {
            type: Date,
            default: Date.now()
        }
    }]
});

complaintSchema.pre('save', function (next) {
    var complaint = this;
    counter.findOneAndUpdate(
        {for :'complaintNumber'},
        {
            $inc: { seq: 1 }
        }, (err, counter) => {
            if (err) {
                res.status(500);
            }
            else {
                if(counter){
                    complaint.complaintNumber = counter.seq;
                    next();
                }
                else{
                    // return Promise.reject('Ref No could not be generated')
                    // return res.status(400).json({
                        // status : 0,
                        console.log('Ref No could not be generated');
                    // });
                    res.status(500)
                }
            }
        });
});

var Complaint = mongoose.model('complaints', complaintSchema);
module.exports = Complaint;

