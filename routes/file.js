const fs = require('fs');
const md5 = require('md5');
const path = require('path');

exports.upload = (req, res) => {

    if (typeof (req.files.file) != "undefined") {
        let fileForUpload = req.files.file;
        let extn = fileForUpload.name.split('.').pop().toLowerCase();
        var dir = '/../uploads/';
        if (!fs.existsSync(__dirname + dir))
            fs.mkdirSync(__dirname + dir);

        if (extn.length) {
            var fName = md5(req.user._id + Date.now()) + '.' + extn;
        }
        else {
            var fName = md5(req.user._id + Date.now());
        }

        fileForUpload.mv(__dirname + dir + fName).then(() => {
            res.status(200).send({
                link: req.protocol + '://' + req.get('host') +'/uploads/'+ fName
            });
        }).catch((e) => {
            return res.status(500).send({
                status: 0,
                msg: 'Could Not Upload Images',
                errorDetails: e
            });
        })
    }
    else {
        res.status(400).send({
            status: 0,
            msg: 'Invalid Request'
        })
    }
}

exports.serve = (req,res) =>{
    var { fileName } = req.params;
    if (fs.existsSync(__dirname + '/../uploads/' + fileName)){
        return res.sendFile(path.resolve(__dirname + '/../uploads/' + fileName));
    }
    else{
        return res.status(404).send();
    }
}