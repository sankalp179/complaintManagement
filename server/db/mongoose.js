var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ComplaintManagement', {
    useMongoClient: true,
    /* other options */
});

// mongoose.set('debug',1)

// mongoose.connection.on('open', function () {
//     mongoose.connection.db.admin().serverStatus(function (error, info) {
//         console.log(info.version);
//     });
// });
module.exports = {mongoose};
