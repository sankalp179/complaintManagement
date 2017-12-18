const fs = require('fs');
const dataFileLocation = './data/relevantPara.txt';

exports.get = (req, res) => {
    try {
        var readStreamObject = fs.createReadStream(dataFileLocation, {
            flags: 'r',
            encoding: "utf8",
            fd: null,
            autoClose: true
        });
        readStreamObject.on('data', function (data) {
            var content = data;
            res.send({
                status: 1,
                content
            });
        });
    } catch (e) {
        res.status(500).send({
            status: 0,
            msg: 'An error occured while loading data',
            errorDetails: e
        });
    }
};

exports.set = (req, res) => {
    if (typeof req.body.content != "undefined") {
        try{
            fs.writeFileSync(dataFileLocation, req.body.content);
            res.send({
                status : 1,
                msg : 'Content Saved Successfully'
            });
        }catch(e){
            res.status(500).send({
                status : 0,
                msg : 'An error occured while saving the data.',
                errorDetails : e
            })
        }
    }
    else {
        res.status(400).send({
            status : 0,
            msg : 'Invalid Request'
        })
    }
};