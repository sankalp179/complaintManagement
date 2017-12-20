const express = require('express');
const hbs = require('hbs'); //Express view engine wrapper for Handlebars
const bodyParser = require('body-parser');
const _ = require('lodash');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');

const { checkAuthentication, checkPrivUser, checkPrivAdmin, checkPrivSuperAdmin, AuthenticationNotWantedFrontend, AuthenticationWantedFrontend, AuthenticationWantedFrontendAdmin, AuthenticationWantedFrontendUser, AuthenticationWantedFrontendSuperAdmin } = require('./server/middleware/authenticate');
const complaintsController = require('./routes/complaint');
const userController = require('./routes/user');
const fileController = require('./routes/file');
const relevantParaLinks = require('./routes/relevantParaLinks.js');
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

// Temporary
app.get('/setup', userController.setup );

app.get('/', AuthenticationNotWantedFrontend, frontend.login);
app.get('/login', AuthenticationNotWantedFrontend, frontend.login);
app.get('/signup', AuthenticationNotWantedFrontend, frontend.signup);
app.get('/resetPassword/:token', AuthenticationNotWantedFrontend, frontend.resetPassword);
app.get('/forgotPassword', AuthenticationNotWantedFrontend, frontend.forgotPassword);

app.get('/profile', AuthenticationWantedFrontend, frontend.profile);
app.get('/home', AuthenticationWantedFrontend, frontend.home);
app.get('/new', AuthenticationWantedFrontend, frontend.new);
app.get('/view/:complaintNumber', AuthenticationWantedFrontend, frontend.view);
app.get('/statistics', AuthenticationWantedFrontend, frontend.stats);

// For SuperAdmin - FrontEnd
app.get('/users', AuthenticationWantedFrontend, AuthenticationWantedFrontendSuperAdmin, frontend.manageAdminUsers);
app.get('/relevantParaLinks', AuthenticationWantedFrontend, AuthenticationWantedFrontendSuperAdmin, frontend.relevantParaLinks);

// For SuperAdmins - BackEnd
app.post('/api/user/register/admin', checkAuthentication, checkPrivSuperAdmin,userController.registerUser);
app.get('/api/user/list/admin', checkAuthentication, checkPrivSuperAdmin, userController.listAdmin);
app.post('/api/user/changeAccStatus', checkAuthentication, checkPrivSuperAdmin, userController.changeAccStatus);
app.post('/api/user/deleteUserAccount', checkAuthentication, checkPrivSuperAdmin, userController.deleteUserAccount);
app.get('/api/relevantParaLinks', checkAuthentication, relevantParaLinks.get);
app.post('/api/relevantParaLinks', checkAuthentication, checkPrivSuperAdmin, relevantParaLinks.set);

// Open APIs
app.post('/api/user/register', userController.registerUser);
app.post('/api/user/login', userController.doLogin);
app.get('/api/user/logout', checkAuthentication, userController.logout);

// User Profile
app.get('/api/user/profile', checkAuthentication, userController.fetchLoggedUserDetails);
app.patch('/api/user/profile', checkAuthentication, userController.editUserDetails);
app.patch('/api/user/password', checkAuthentication, userController.changePassword);
app.get('/api/user/generateOTP', checkAuthentication, userController.generateOTP);
app.post('/api/user/checkOTP', checkAuthentication, userController.checkOTP);

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
