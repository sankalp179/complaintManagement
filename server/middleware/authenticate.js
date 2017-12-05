const mongoose = require('../db/mongoose.js');
const User = require('../models/user.js');
const _ = require('lodash');

// FOR Checking Authorization in APIs
exports.checkAuthentication = (req, res, next) => {
    if (typeof req.header('x-auth') != "undefined" || typeof req.cookies.x_auth != "undefined") {
        if (typeof req.header('x-auth') != "undefined")
            var token = req.header('x-auth');
        else
            var token = req.cookies.x_auth;
        User.findbyToken(token).then((user) => {
            if (!user) {
                return res.status(401).json({
                    status: 0,
                    msg: 'Authentication Failed.',
                    errorCode: 'AUTH-1'
                });
            }
            else {
                req.user = user;
                req.token = token;
                next();
            }
        }).catch((e) => {
            res.status(401).json({
                status: 0,
                msg: 'Authentication Failed.',
                errorCode: 'AUTH-2'
            });
        });
    }
    else {
        res.status(401).json({
            status: 0,
            msg: 'Authentication Failed.',
            errorCode: 'AUTH-3'
        });
    }
}

exports.checkPrivAdmin = (req, res, next) => {
    if (!(typeof (req.user.userType) != "undefined" && req.user.userType === "admin")) {
        res.status(401).json({
            status: 0,
            msg: 'Operation Not Permitted. Insufficient Priviledge.'
        });
    }
    else {
        next();
    }
}

exports.checkPrivUser = (req, res, next) => {
    if (!(typeof (req.user.userType) != "undefined" && req.user.userType === "user")) {
        res.status(401).json({
            status: 0,
            msg: 'Operation Not Permitted. Insufficient Priviledge.'
        });
    }
    else {
        next();
        // --- For Checking Mob Verification Status ---
        // if (req.user.mobileVerified){
        //     next();
        // }
        // else{
        //     res.status(401).json({
        //         status : 0,
        //         msg :'You need to verify your mobile number first '
        //     });
        // }
    }
}

// For Checking Access to Frontend Pages.
exports.AuthenticationWantedFrontend = (req, res, next) => {
    let countStepsBack = _.split(_.trim(req._parsedOriginalUrl.path, '/'), '/'), loginUrl = '';
    countStepsBack.forEach(element => loginUrl += '../');
    loginUrl += 'login';
    loginUrl = loginUrl.substring(1);

    if (typeof req.header('x-auth') != "undefined" || typeof req.cookies.x_auth != "undefined") {
        if (typeof req.header('x-auth') != "undefined")
            var token = req.header('x-auth');
        else
            var token = req.cookies.x_auth;
        User.findbyToken(token).then((user) => {
            if (!user) {
                res.redirect(loginUrl);
            }
            else {
                req.user = user;
                req.token = token;
                next();
            }
        }).catch((e) => {
            res.redirect(loginUrl);
        });
    }
    else {
        res.redirect(loginUrl);
    }
}

exports.AuthenticationNotWantedFrontend = (req, res, next) => {

    if (typeof req.header('x-auth') != "undefined" || typeof req.cookies.x_auth != "undefined") {
        if (typeof req.header('x-auth') != "undefined")
            var token = req.header('x-auth');
        else
            var token = req.cookies.x_auth;
        User.findbyToken(token).then((user) => {
            if (!user) {
                next();
            }
            else {
                res.redirect('./home');
            }
        }).catch((e) => {
            next();
        });
    }
    else {
        next();
    }
}