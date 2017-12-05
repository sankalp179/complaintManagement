const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const mongoose = require('./../server/db/mongoose');
const User = require('./../server/models/user');

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
                            return newUser.generateAuthToken();
                        })
                        .then((token) => {
                            res.header('x-auth', token).cookie('x_auth', token, { maxAge: 86400000*7 }).json({
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
        return user.generateAuthToken().then((token) => {
            return res.header('x-auth', token).cookie('x_auth', token, { maxAge: 86400000 * 7 }).json({
                status: 1,
                msg: 'Login Successful',
                user
            });
        }).catch((e) => {
            return res.status(400).send();
        });
    }).catch((e) => {
        return res.status(400).json({
            status: 0,
            msg: 'Authentication failed'
        })
    });

}

exports.logout = (req,res) => {
    req.user.removeToken(req.token).then(()=>{
        return res.status(200).send({
            status : 1,
            msg : 'Successfully Logged Out.'
        });
    },()=>{
        return res.status(400).send({
            status : 0,
            msg : 'Unable to Log Out'
        });
    })
}
