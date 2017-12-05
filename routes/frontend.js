// -- Open Routes -- //
exports.login = (req, res) => {
    res.render('login.hbs',{
        user: '',
        isad: 0,
        title: 'Login',
        pname: 'login',
        cno : 0,
        level : ''
    });
}
exports.signup = (req, res) => {
    res.render('signup.hbs', {
        user: '',
        isad: 0,
        title: 'SignUp',
        pname: 'signup',
        cno : 0,
        level : ''
    });
}

// -- Protected Routes -- //


exports.home = (req, res) => {
    res.render('all.hbs', {
        complaintNumber: req.params.complaintNumber,
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        title: 'All Complaints',
        pname: 'home',
        cno : 0,
        level :''
    })
}
exports.new = (req, res) => {
    res.render('new.hbs',{
        title: 'Register New Complaint/Suggestion',
        pname: 'new',
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        cno : 0,
        level :''
    });
}

exports.view = (req, res) => {
    res.render('preview.hbs', {
        title: 'View Complaint #' + req.params.complaintNumber,
        pname: 'view',
        user: (typeof req.user !== "undefined") ? req.user.name : '',
        isad: Number(req.user.userType == "admin"),
        cno: req.params.complaintNumber,
        level : '../'
    });
}
exports.account = (req, res) => {
    // res.render()
}