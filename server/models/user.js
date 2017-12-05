const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('./../../config/authSecret.js');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        length: 10,
        required: true
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    aadharNumber: {
        type: Number,
        length: 12,
        required: true
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id','name', 'email', 'userType', 'mobileVerified']);
}

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';

    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, jwtSecret).toString();

    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    })
}

userSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull : {
            tokens : {token}
        }
    });
}

userSchema.statics.findbyToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, jwtSecret);
    }
    catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

userSchema.statics.findByCredentials = function (email, enteredPassword) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject('User not found');
        }
        else {
            return new Promise((resolve, reject) => {

                bcrypt.compare(enteredPassword, user.password, (err, res) => {
                    if (res)
                        resolve(user);
                    else
                        reject('Wrong Password');
                });

            }).catch((e) => {
                reject('Server Error');
            });
        }
    });
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.status(500).json({
                    msg: 'Server Error',
                    status: 0,
                    err: err
                });
            }

            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else
        next();
})

var User = mongoose.model('users', userSchema);

module.exports = User;
