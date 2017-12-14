const { organization_name } = require('../config/organization');

// -- Open Routes -- //
exports.login = (req, res) => {
    res.render('login.hbs', {
        user: '',
        isad: 0,
        title: `Login | ${organization_name}`,
        organization_name,
        pname: 'login',
        cno: 0,
        level: ''
    });
}
exports.signup = (req, res) => {
    res.render('signup.hbs', {
        user: '',
        isad: 0,
        title: `SignUp | ${organization_name}`,
        organization_name,
        pname: 'signup',
        cno: 0,
        level: ''
    });
}

exports.forgotPassword = (req,res) =>{
    res.render('forgotPassword.hbs',{
        user : '',
        isad : 0,
        title: `Forgot Password |  ${organization_name}`,
        organization_name,
        pname: 'forgotPassword',
        cno : 0,
        level : ''
    })
}

exports.resetPassword = (req,res) =>{
    res.render('resetPassword.hbs',{
        user : '',
        isad : 0,
        title: `Reset Password |  ${organization_name}`,
        organization_name,
        pname : 'resetPassword',
        cno : 0,
        level : '../',
        resetToken : req.params.token
    })
}
// -- Protected Routes -- //


exports.home = (req, res) => {
    res.render('all.hbs', {
        complaintNumber: req.params.complaintNumber,
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        title: `All Complaints | ${organization_name}`,
        organization_name,
        pname: 'home',
        cno: 0,
        level: ''
    })
}
exports.new = (req, res) => {
    res.render('new.hbs', {
        title: `Register New Complaint/Suggestion | ${organization_name}`,
        organization_name,
        pname: 'new',
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        cno: 0,
        level: ''
    });
}

exports.view = (req, res) => {
    res.render('preview.hbs', {
        title: `View Complaint #${req.params.complaintNumber} | ${organization_name}`,
        organization_name,
        pname: 'view',
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        cno: req.params.complaintNumber,
        level: '../'
    });
}
exports.account = (req, res) => {
    // res.render()
}

exports.stats = (req, res) => {
    res.render('stats.hbs',{
        title: `Statistics | ${organization_name}`,
        organization_name,
        pname: 'stats',
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        cno: 0,
        level: '../'
    });
}