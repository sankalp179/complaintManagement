const express = require('express');
const hbs = require('hbs'); //Express view engine wrapper for Handlebars
const bodyParser = require('body-parser');
const _ = require('lodash');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');

const { checkAuthentication, checkPrivUser, checkPrivAdmin, AuthenticationNotWantedFrontend, AuthenticationWantedFrontend } = require('./server/middleware/authenticate');
const complaintsController = require('./routes/complaint');
const userController = require('./routes/user');
const fileController = require('./routes/file');
const frontend = require('./routes/frontend');

var app = express();

// Views
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileUpload());
app.use(cookieParser());

// Defining App Routes
app.get('/', AuthenticationNotWantedFrontend, frontend.login);
app.get('/login', AuthenticationNotWantedFrontend, frontend.login);
app.get('/signup', AuthenticationNotWantedFrontend, frontend.signup);
app.get('/resetPassword/:token', AuthenticationNotWantedFrontend, frontend.resetPassword);
app.get('/forgotPassword', AuthenticationNotWantedFrontend, frontend.forgotPassword);

app.get('/account', AuthenticationWantedFrontend, frontend.account);
app.get('/home', AuthenticationWantedFrontend, frontend.home);
app.get('/new', AuthenticationWantedFrontend, frontend.new);
app.get('/view/:complaintNumber', AuthenticationWantedFrontend, frontend.view);
app.get('/statistics', AuthenticationWantedFrontend, frontend.stats);
// app.get('/profile',checkAuthentication,frontend.showProfile);

app.post('/api/user/register', userController.registerUser);
app.get('/api/user/me', checkAuthentication, userController.fetchLoggedUserDetails);
app.post('/api/user/login', userController.doLogin);
app.get('/api/user/logout', checkAuthentication, userController.logout);

// Edit User Profile
app.patch('/api/user/profile', checkAuthentication, userController.editUserDetails);
app.patch('/api/user/password', checkAuthentication, userController.changePassword);

app.post('/api/user/requestResetPassword', userController.requestResetPassword);
app.post('/api/user/validateResetPasswordToken',userController.validateResetPasswordToken);
app.post('/api/user/resetPassword',userController.resetPassword);


app.get('/api/complaints/stats', checkAuthentication, checkPrivAdmin, complaintsController.getStats);
app.post('/api/complaints/new', checkAuthentication, checkPrivUser, complaintsController.registerNewComplaint);
app.get('/api/complaints/all', checkAuthentication, complaintsController.listAllComplaints);
app.get('/api/complaints/:complaintNumber', checkAuthentication, complaintsController.getComplaint);
app.post('/api/complaints/updateStatus/:complaintNumber', checkAuthentication, checkPrivAdmin, complaintsController.updateStatus)
app.post('/api/complaints/share/:complaintNumber', checkAuthentication, checkPrivAdmin, complaintsController.emailComplaint)

app.post('/upload', checkAuthentication, fileController.upload);
app.get('/uploads/:fileName', fileController.serve);
let serverPort = 3000;
app.listen(serverPort, () => {
    console.log(`Server Started. Listening at Port ${serverPort}`);
});
