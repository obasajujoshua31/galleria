var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
})

var upload = multer({ 
        storage: storage,
        limits: {fileSize: 1000000},
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }

}).single('myImage');

function checkFileType(file, cb){

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

        if(extname && mimetype){
                cb(null, true);
        } else {
            cb('File Type is not supported. (jpg,jpeg,png,gif) only')

        }
}
/* GET home page. */
router.get('/', function (req, res, next) {
     res.render('photoalbum', { 
         title: 'My Photo Album',
        //  files:    '/uploads/myImage-1537906707542.png'
        files: uploadsPic
     }); 
});


let uploadsPic  = [];
router.post('/', function(req, res, next){
            upload(req, res, function(err){
                if(err) {
                    res.render('index', {
                            error: err,
             });
                } else {
                    if(req.file==undefined){
                        res.render('index',{
                        error: "No file Selected!"
                        });
                    } else {
                        uploadsPic.push('uploads/' +req.file.filename);
                        res.render('index', {
                            msg: "File Uploaded Successfully!",
                            file: 'uploads/'+ req.file.filename
                        });
                    }    
                } 
    });
});
module.exports = router;

