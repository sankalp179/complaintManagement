const nodemailer = require('nodemailer');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const mongoose = require('./../server/db/mongoose');
const User = require('./../server/models/user');

const { emailConfig, adminEmailAddress } = require('./../config/email');

exports.registerUser = (req, res) => {
    // Validating Name
    if (typeof (req.body.name) == "undefined") {
        return res.status(400).json({
            msg: 'Name missing',
            status: 0,
            request: req.body
        });
    }
    else {
        var name = req.body.name;
        if (!validator.trim(name).length) {
            return res.status(400).json({
                msg: 'Name can\'t be empty',
                status: 0
            });
        }
    }

    // Validating Email
    if (typeof (req.body.email) == "undefined") {
        return res.status(400).json({
            msg: 'email missing',
            status: 0
        });
    }
    else {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({
                msg: 'Invalid Email',
                status: 0
            });
        }
        else {
            var email = req.body.email;
        }
    }

    // Validating Mobile
    if (typeof (req.body.mobile) == "undefined") {
        return res.status(400).json({
            msg: 'mobile missing',
            status: 0
        });
    }
    else {
        if (!validator.isMobilePhone(req.body.mobile, ['en-IN'])) {
            return res.status(400).json({
                msg: 'Invalid Mobile Number',
                status: 0
            });
        }
        else
            var mobile = req.body.mobile;
    }

    // Validating Password
    if (typeof (req.body.password) == "undefined") {
        return res.status(400).json({
            msg: 'Password missing',
            status: 0
        });
    }
    else {
        if (req.body.password.length < 6) {
            return res.status(400).JSON({
                status: 0,
                msg: 'Password has to be of atleast 6 chars'
            });
        }
    }



    // Validating Aadhar Number
    if (typeof (req.body.aadharNumber) == "undefined") {
        return res.status(400).json({
            msg: 'aadharNumber missing',
            status: 0
        });
    }
    else {
        if (!(validator.isNumeric(req.body.aadharNumber) && (validator.trim(req.body.aadharNumber).length == 12))) {
            return res.status(400).json({
                msg: 'Invalid aadharNumber',
                status: 0
            });
        }
        else {
            var aadharNumber = req.body.aadharNumber;
        }
    }

    // Checking If Email isn't associated with any other account.
    User.findOne({ 'email': email }).then((doc) => {
        if (doc) {
            return res.status(400).json({
                status: 0,
                msg: 'Entered email is already associated with another account.'
            });
        }
        else {
            // Checking if Mobile isn't associated with any other account.
            User.findOne({ mobile: mobile, mobileVerified: true }).then((doc) => {
                if (doc) {
                    return res.status(400).json({
                        status: 0,
                        msg: 'Entered mobile is already associated with another account.'
                    });
                }
                else {
                    // Register the User.
                    var newUser = new User({
                        name: req.body.name,
                        mobile: req.body.mobile,
                        aadharNumber: req.body.aadharNumber,
                        email: req.body.email,
                        password: req.body.password
                    });

                    newUser.save()
                        .then(() => {
                            return newUser.generateToken();
                        })
                        .then((token) => {
                            res.header('x-auth', token).cookie('x_auth', token, { maxAge: 86400000 * 7 }).json({
                                status: 1,
                                msg: 'User Registration Successful',
                                user: newUser,
                                token: token
                            });
                        })
                        .catch((e) => {
                            res.status(500).json({
                                msg: 'Sever error',
                                err: e
                            });
                        });
                }
            }).catch((e) => {
                return res.status(500).json({
                    status: 0,
                    msg: 'Error occured while processing your request.',
                    err: e
                })
            });
        }
    }).catch((e) => {
        return res.status(500).json({
            status: 0,
            msg: 'Error occured while processing your request.',
            err: e
        })
    });


};

exports.editUserDetails = (req, res) => {
    req.body = _.pick(req.body, ['name', 'mobile', 'email', 'aadharNumber']);
    if (typeof (req.body.name) === "undefined" || typeof (req.body.mobile) === "undefined" || typeof (req.body.email) === "undefined" || typeof (req.body.aadharNumber) === "undefined") {
        res.status(400).send({
            status: 0,
            msg: "Invalid request"
        })
    }
    else {
        var { name, email, mobile, aadharNumber } = req.body;
        if (!validator.trim(name).length) {
            return res.status(400).json({
                msg: 'Name can\'t be empty',
                status: 0
            });
        }
        else {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    msg: 'Invalid Email',
                    status: 0
                });
            }
            else {
                if (!validator.isMobilePhone(mobile, ['en-IN'])) {
                    return res.status(400).json({
                        msg: 'Invalid Mobile Number',
                        status: 0
                    });
                }
                else {
                    if (!(validator.isNumeric(aadharNumber) && (validator.trim(aadharNumber).length == 12))) {
                        return res.status(400).json({
                            msg: 'Invalid aadharNumber',
                            status: 0
                        });
                    }
                    else {
                        // All Good. çheck duplicacy of Mobile, Email
                        // Checking If Email isn't associated with any other account.
                        User.findOne({
                            'email': email,
                            '_id': {
                                $ne: req.user._id
                            }
                        })
                            .then((doc) => {
                                if (doc) {
                                    return res.status(400).json({
                                        status: 0,
                                        msg: 'Entered email is already associated with another account.'
                                    });
                                }
                                else {
                                    // Checking if Mobile isn't associated with any other account.
                                    User.findOne({
                                        mobile: mobile,
                                        mobileVerified: true,
                                        _id: {
                                            $ne: req.user._id
                                        }
                                    }).
                                        then((doc) => {
                                            if (doc) {
                                                return res.status(400).json({
                                                    status: 0,
                                                    msg: 'Entered mobile is already associated with another account.'
                                                });
                                            }
                                            else {
                                                var mobVerificationStatus = (req.user.mobile == mobile) ? req.user.mobileVerified : false;
                                                // Register the User.
                                                User.findByIdAndUpdate(req.user._id, {
                                                    $set: {
                                                        name,
                                                        email,
                                                        aadharNumber,
                                                        mobile,
                                                        mobileVerified: mobVerificationStatus
                                                    }
                                                }, (err, doc) => {
                                                    if (err) {
                                                        res.status(500).send({
                                                            status: 0,
                                                            msg: 'An error occured while updating the details',
                                                            errorDetails: err
                                                        });
                                                    }
                                                    else {
                                                        res.send({
                                                            status: 1,
                                                            msg: 'Details Updated successfully',
                                                            newDetails: doc
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                }
                            });
                    }
                }
            }
        }
    }
}

exports.requestResetPassword = (req, res) => {
    // generateForgotPassToken
    if (typeof req.body.email == "undefined" || typeof req.body.mobile == "undefined"){
        res.status(400).send({
            status : 0,
            msg : 'Invalid Request.'
        });
    }
    else{
        var {mobile,email} = req.body;
        if (!validator.isMobilePhone(mobile, ['en-IN'])){
            res.status(400).send({
                status : 0,
                msg : 'Invalid Mobile Number'
            });
        }
        else{
            if(!validator.isEmail(email)){
                res.status(400).send({
                    status : 0,
                    msg  :'Invalid Email Address'
                });
            }
            else{
                User.findOne({
                    email ,
                    mobile
                }).then((doc)=>{
                    if(doc){
                        console.log(doc)
                         doc.generateToken('forgotPass').then((token) => {
                            var resetLink = req.protocol + '://' + req.get('host') +'/resetPassword/'+token;
                            var transporter = nodemailer.createTransport(emailConfig);

                            var mailOptions = {
                                from: adminEmailAddress,
                                to: `${doc.email}`,
                                subject: `Password Reset Instructions`,
                                html: `
                                        <p>Dear ${doc.name},</p>
                                        <p>You have raised a request to reset the password for your account. Please click the link below to reset the password.</p>
                                        <br><a href="${resetLink}">Click to Reset Password</a><br>
                                        <small>In case you haven't requested password reset, you can safely ignore this email.</small>
                                        `
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    res.status(500).send({
                                        status: 0,
                                        msg: 'An error occured while processing your request.',
                                        errorDetails: error
                                    })
                                }
                                else {
                                    res.send({
                                        status: 1,
                                        msg: 'Password Reset Instructions Sent to your email',
                                        details: info.response
                                    })
                                }
                            });

                        }).catch((e) => {
                            return res.status(400).send(e);
                        });
                    }
                    else{
                        res.status(400).send({
                            status : 0,
                            msg : 'No account is associated with the above details'
                        });
                    }
                }).catch((e)=>{
                    res.status(400).send({
                        status: 0,
                        msg: 'No account is associated with the above details'
                    });
                })
            }
        }
    }
}

exports.validateResetPasswordToken = (req,res) => {
    if(typeof req.body.resetToken === "undefined"){
        res.status(400).send({
            status : 0,
            msg : 'Invalid Request',
            errorDetails : 'Reset Token Not Found'
        });
    }
    else{
        var {resetToken} = req.body;
        User.findbyToken(resetToken,'forgotPass').then((user) => {
            if (!user) {
                return res.status(400).json({
                    status: 0,
                    msg: 'You seemed to have clicked an Invalid or no longer valid reset password URL. Kindly check the link or request again from forgot Password Page.'
                });
            }
            else {
                return res.send({
                    status : 1,
                    msg : 'Please fill the new password',
                    user : user
                });
            }
        }).catch((e) => {
            res.status(400).json({
                status: 0,
                msg: 'You seemed to have clicked an Invalid or no longer valid reset password URL. Kindly check the link or request again from forgot Password Page.',
                errorDetails : e
            });
        });
    }
}

var getPasswordHash = (password)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                return reject(err);
            else{
                bcrypt.hash(password, salt, (err2, hash) => {
                    if (err2)
                        return reject(err2);
                    else
                        return resolve(hash)
                });
            }
        });
    })
}

exports.resetPassword = (req,res)=>{
    if (typeof req.body.resetToken === "undefined" || typeof req.body.password ==="undefined" || req.body.password.length<6) {
        res.status(400).send({
            status: 0,
            msg: 'Invalid Request',
            errorDetails: 'Reset_Password_5'
        });
    }
    else {
        var { resetToken,password } = req.body;
        User.findbyToken(resetToken, 'forgotPass').then((userDoc) => {
            if (!userDoc) {
                return res.status(400).json({
                    status: 0,
                    msg: 'You seemed to have clicked an Invalid or no longer valid reset password URL. Kindly check the link or request again from forgot Password Page.',
                    errorDetails: 'Reset_Password_4'
                });
            }
            else {
                getPasswordHash(password).then((hash)=>{
                    User.findByIdAndUpdate(userDoc._id,{
                        $set : {
                            password : hash 
                        },
                        $pull : {
                            tokens : {
                                token : resetToken,
                                access : 'forgotPass'
                            }
                        }
                    }).then((doc)=>{
                        if(doc){
                            res.status(200).send({
                                status : 1,
                                msg : 'Password Reset Successful.'
                            })
                        }
                        else{
                            res.status(400).send({
                                status : 0,
                                msg : 'An error occured while resting your account password',
                                errorDetails: 'Reset_Password_3'
                            })
                        }
                    }).catch((e)=>{
                        res.status(400).send({
                            status: 0,
                            msg: 'An error occured while resting your account password',
                            errorDetails: 'Reset_Password_2'
                        })
                    })
                }).catch((e)=>{
                    res.status(500).send({
                        status  : 0,
                        msg : 'Error occured while communicating with server',
                        errorDetails : 'Reset_Password_1'
                    });
                })
            }
        }).catch((e) => {
            res.status(400).json({
                status: 0,
                msg: 'You seemed to have clicked an Invalid or no longer valid reset password URL. Kindly check the link or request again from forgot Password Page.',
                errorDetails: 'Reset_Password_6',
                e
            });
        });
    }
};

exports.fetchLoggedUserDetails = (req, res) => {
    User.findById(req.user._id).then((doc) => {
        // console.log(doc);
        var { name, mobile, email, aadharNumber, mobileVerified } = doc;
        if (doc) {
            res.json({ name, mobile, email, aadharNumber, mobileVerified });
        }
        else {
            res.status(400).json({
                status: 0,
                msg: 'User Not Found',
                code: 'AC - 1'
            })
        }
    }).catch((e) => {
        res.status(400).json({
            status: 0,
            msg: 'User Not Found',
            code: 'AC-2'
        })
    })
}

exports.doLogin = (req, res) => {
    req.body = _.pick(req.body, ['email', 'password']);
    if (typeof (req.body.email) === "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Email Missing'
        })
    }
    else {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({
                status: 0,
                msg: 'Invalid Email Entered'
            });
        }
        else {
            var email = req.body.email;
        }
    }

    if (typeof (req.body.password) === "undefined") {
        return res.status(400).json({
            status: 0,
            msg: 'Password Missing'
        });
    }
    else {
        if (!req.body.password.length) {
            return res.status(400).json({
                status: 0,
                msg: 'Passowrd missing'
            });
        }
        else {
            var enteredPassword = req.body.password;
        }
    }

    User.findByCredentials(email, enteredPassword).then((user) => {
        return user.generateToken().then((token) => {
            return res.header('x-auth', token).cookie('x_auth', token, { maxAge: 86400000 * 7 }).json({
                status: 1,
                msg: 'Login Successful',
                user
            });
        }).catch((e) => {
            return res.status(400).send(e);
        });
    }).catch((e) => {
        return res.status(400).json({
            status: 0,
            msg: 'Authentication failed'
        })
    });

}

exports.logout = (req, res) => {
    req.user.removeToken(req.token).then(() => {
        return res.status(200).send({
            status: 1,
            msg: 'Successfully Logged Out.'
        });
    }, () => {
        return res.status(400).send({
            status: 0,
            msg: 'Unable to Log Out'
        });
    })
}
