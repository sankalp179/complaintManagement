// import { read } from 'fs';
const nodemailer = require('nodemailer');
const validator = require('validator');
const _ = require('lodash');

const mongoose = require('./../server/db/mongoose'); //config
const Complaint = require('./../server/models/complaint');

const { emailConfig, adminEmailAddress } = require('./../config/email');

exports.registerNewComplaint = (req, res) => {
    var complaintBody = _.pick(req.body, ['complaintType', 'location', 'relevantParaClause', 'objectionOrSuggestion', 'complaintDesc', 'paraClauseLink']);
    if (typeof (complaintBody.complaintType) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Type required'
        });
    }
    else {
        if (["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", "Traffic & Transportation", "Others"].indexOf(validator.trim(complaintBody.complaintType)) == -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Type required'
            });
        }
    }

    if (typeof (complaintBody.location) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Location is required'
        });
    }
    else {
        if (!validator.trim(complaintBody.location)) {
            return res.status(400).json({
                status: 0,
                msg: 'Location is required'
            });
        }
    }

    if (typeof (complaintBody.relevantParaClause) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Please enter relevant Para/Clause'
        });
    }
    else {
        if (!validator.trim(complaintBody.relevantParaClause)) {
            return res.status(400).json({
                status: 0,
                msg: 'Please enter relevant Para/Clause'
            });
        }
    }

    if (typeof (complaintBody.complaintDesc) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Complaint Description is required'
        });
    }
    else {
        if (!validator.trim(complaintBody.complaintDesc)) {
            return res.status(400).json({
                status: 0,
                msg: 'Complaint Description is required'
            });
        }
    }

    if (typeof (complaintBody.objectionOrSuggestion) == "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Select whether its a complaint or suggestion.'
        });
    }
    else {
        if (['Objection', 'Suggestion'].indexOf(validator.trim(complaintBody.objectionOrSuggestion)) === -1) {
            return res.status(400).json({
                status: 0,
                msg: 'Select whether its a complaint or suggestion.'
            });
        }
    }

    var newComplaint = new Complaint({
        complaintType: complaintBody.complaintType,
        location: complaintBody.location,
        relevantParaClause: complaintBody.relevantParaClause,
        objectionOrSuggestion: complaintBody.objectionOrSuggestion,
        complaintDesc: complaintBody.complaintDesc,
        complainant: req.user._id,
        actionTrail: [{
            user: req.user._id,
            action: 'Submitted',
            datetime: Date.now()
        }],
        postedOn: Date.now()
    });

    newComplaint.save((err, registeredComplaint) => {
        if (err) {
            res.status(500).json({
                status: 0,
                msg: 'Server Error',
                errorDetails: err
            });
        }
        else {
            res.json({
                status: 1,
                msg: `Your ${registeredComplaint.objectionOrSuggestion} was successfully registered.`,
                refNo: registeredComplaint.complaintNumber
            });
        }
    });
}

exports.listAllComplaints = (req, res) => {
    if (req.user.userType === "user") {
        var query = Complaint.find({
            complainant: req.user._id,
        }, '-actionTrail -official -_id -__v').populate('complainant', 'name-_id').exec();
    }
    else {
        var query = Complaint.find({}, '-actionTrail -_id -__v').populate([{
            path: 'complainant',
            select: 'name-_id'
        }]).exec();
    }

    query.then((allcomplaints) => {
        return res.send({
            status: 1,
            data: allcomplaints
        })
    }).catch((e) => {
        return res.status(500).json({
            status: 0,
            msg: 'Server Error',
            errorDetails: e
        })
    })
}

exports.getComplaint = (req, res) => {
    var { complaintNumber } = req.params;
    if (validator.isNumeric(complaintNumber)) {

        if (req.user.userType == "user") {

            var query = Complaint.findOne({
                complaintNumber,
                complainant: req.user._id
            }, ' -official -_id -__v')
                .populate([{
                    path: 'complainant',
                    select: 'name-_id'
                }, {
                    path: 'actionTrail.user',
                    select: 'userType-_id'
                }]).exec();
        }
        else {
            var query = Complaint.findOne({
                complaintNumber
            }, '-_id -__v')
                .populate({
                    path: 'complainant',
                    select: 'name mobile email-_id'
                })
                .populate({
                    path: 'actionTrail.user',
                    select: 'name userType-_id'
                })
                .exec();
        }
        query.then((complaint) => {
            if (!complaint) {
                return res.status(404).status({
                    status: 0,
                    msg: 'The requested resources does not exist or you do not have sufficient priviledge to access it.'
                });
            }
            else {
                return res.send(complaint);
            }
        })
    }
    else {
        return res.status(400).json({
            status: 0,
            msg: 'Invalid Request.'
        });
    }
}

exports.updateStatus = (req, res) => {
    if (validator.isNumeric(req.params.complaintNumber)) {
        var complaintNumber = req.params.complaintNumber;

        if (typeof (req.body.newStatus) !== "undefined" && ['Under Consideration', 'Replied'].indexOf(validator.trim(req.body.newStatus)) != -1) {
            var newStatus = validator.trim(req.body.newStatus);
            var remarks = '';
            if (req.body.newStatus == "Replied" && typeof req.body.remarks == "undefined") {
                res.status(400).send({
                    status: 0,
                    msg: 'Invalid Request'
                })
            }
            else {
                remarks = req.body.remarks;
            }
            Complaint.findOne({
                complaintNumber
            }).exec().then((savedComplaint) => {
                if (!savedComplaint) {
                    res.status(400).send({
                        status: 0,
                        msg: 'Invalid Complaint Number'
                    });
                }
                else {
                    if (savedComplaint.status == "Replied") {
                        return res.status(400).send({
                            status: 0,
                            msg: 'No further action is possible as it has been marked as Replied.'
                        });
                    }
                    else if (savedComplaint.status == "Under Consideration" && newStatus != "Replied") {
                        return res.status(400).send({
                            status: 0,
                            msg: 'Only allowed action is marking it as Replied.'
                        });
                    }
                    else {
                        // Continue to update status/ official / actionTrail
                        var query = Complaint.findByIdAndUpdate(savedComplaint._id, {
                            $set: {
                                status: newStatus,
                                official: req.user._id
                            },
                            $push: {
                                actionTrail: {
                                    datetime: Date.now(),
                                    action: `Status Changed to ${newStatus}`,
                                    remarks,
                                    user: req.user._id
                                }
                            }
                        }).exec().then((result) => {
                            if (!result) {
                                return res.status(400).send({
                                    status: 0,
                                    msg: 'The status could not be updated.'
                                });
                            }
                            else {
                                return res.send({
                                    status: 1,
                                    msg: `Status successfully changed to ${newStatus}`
                                });
                            }
                        }).catch((e) => {
                            return res.status(500).send({
                                status: 0,
                                msg: 'Server Error',
                                errorDetails: e
                            })
                        });
                    }
                }
            });

            $query = Complaint.findOneAndUpdate({
                complaintNumber
            }, {
                    status: newStatus
                }).exec();

        }
        else {
            res.status(400).send({
                status: 0,
                msg: 'Invalid Request'
            })
        }
    }
    else {
        res.status(400).send({
            status: 0,
            msg: 'Invalid Request.'
        })
    }
}

exports.getStats = (req, res) => {
    $query = Complaint.aggregate([
        {
            $group: {
                _id: {
                    objectionOrSuggestion: '$objectionOrSuggestion',
                    complaintType: '$complaintType'
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id.objectionOrSuggestion": 1,
                "_id.complaintType": 1
            }
        }
    ]).exec().then((result) => {
        Complaint.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: {
                        $sum: 1
                    }
                }
            }
        ]).exec().then((result2) => {
            res.send({
                status : 1,
                cStatus : result2,
                cType : result
            });
            
        }).catch((e) => {
            res.status(400).send({
                status : 0,
                msg : 'An error occured while fetching data',
                errorDetails :e
            });
        });
    }).catch((e) => {
        res.status(400).send({
            status : 0,
            msg : 'An error occured while fetching data',
            errorDetails :e
        });
    });
}

exports.emailComplaint = (req, res) => {
    if (typeof req.body.email != "undefined" && typeof req.body.emailBody != "undefined" && validator.isNumeric(req.params.complaintNumber)) {
        if (validator.isEmail(req.body.email)) {
            var receiverEmailAddress = req.body.email;
            var emailBody = req.body.emailBody.trim();
            var complaintNumber = req.params.complaintNumber;

            var query = Complaint.findOne({
                complaintNumber
            }, '-_id -__v')
                .populate({
                    path: 'complainant',
                    select: 'name mobile email-_id'
                })
                .populate({
                    path: 'actionTrail.user',
                    select: 'name userType-_id'
                })
                .exec();

            query.then((complaint) => {
                if (!complaint) {
                    return res.status(404).status({
                        status: 0,
                        msg: 'The requested resources does not exist or you do not have sufficient priviledge to access it.'
                    });
                }
                else {
                    var transporter = nodemailer.createTransport(emailConfig);

                    var mailOptions = {
                        from: adminEmailAddress,
                        to: `${receiverEmailAddress} , ${req.user.email}`,
                        subject: `Sharing ${complaint.objectionOrSuggestion} #${complaint.complaintNumber}`,
                        html: `${emailBody}
                        <br>
                        <table>
                                <tr>
                                    <td colspan="2">Complainant</td>
                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>${complaint.complainant.name}</td>
                                </tr>
                                <tr>
                                    <td>Mobile</td>
                                    <td>${complaint.complainant.mobile}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>${complaint.complainant.email}</td>
                                </tr>

                                <tr>
                                    <td colspan="2">${complaint.objectionOrSuggestion} Details</td>
                                </tr>

                                <tr>
                                    <td>ID</td>
                                    <td>${complaint.complaintNumber}</td>
                                </tr>
                                <tr>
                                    <td>Registration Date</td>
                                    <td>${complaint.postedOn}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>${complaint.location}</td>
                                </tr>
                                <tr>
                                    <td>Relevant Para/Clause</td>
                                    <td>${complaint.relevantParaClause}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>${complaint.status}</td>
                                </tr>
                            </table>
                            <h4>${complaint.objectionOrSuggestion} Description</h4><br>
                                ${complaint.complaintDesc}
                        `
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.status(500).send({
                                status: 0,
                                msg: 'Could Not Email the complaint.',
                                errorDetails: error
                            })
                        }
                        else {
                            res.send({
                                status: 1,
                                msg: 'Email Sent successfully',
                                details: info.response
                            })
                        }
                    });

                }
            })
        }
        else {
            res.status(400).send({
                status: 0,
                msg: 'Invalid Request'
            });
        }
    }
    else {
        res.status(400).send({
            status: 0,
            msg: 'Invalid Request'
        });
    }
}