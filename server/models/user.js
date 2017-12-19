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
    superAdmin: {
        type: Boolean,
        default: false
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
    }],
    accountActive: {
        type: Boolean,
        default: true
    },
    OTP: [{
        otp: {
            type: String,
            required: true
        },
        validTill: {
            type: Date,
            default: Date.now() + 300000 //5 mins from now
        },
        refNo: {
            type: String
        },
        mobile: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'name', 'mobile', 'email', 'userType', 'mobileVerified', 'superAdmin', 'accountActive']);
}

userSchema.methods.generateToken = function (tokenType = 'auth') {
    var user = this;
    var access = tokenType;

    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, jwtSecret).toString();

    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    })
}

userSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
}

userSchema.statics.findbyToken = function (token, tokenType = 'auth') {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, jwtSecret);
    }
    catch (e) {
        return Promise.reject('Invalid token');
    }
    // console.log('\n', '\n', decoded, '\n', '\n');
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': tokenType
    });
}

userSchema.statics.findByCredentials = function (email, enteredPassword) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject('We could not find an account with those details');
        }
        else {
            return new Promise((resolve, reject) => {
                bcrypt.compare(enteredPassword, user.password, (err, res) => {
                    if (res) {
                        if (user.accountActive)
                            resolve(user);
                        else
                            reject('Your Account is temporarily disabled.');
                    }
                    else {
                        reject('We could not find an account with those details');
                        // reject('Wrong Password');
                    }
                });
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
