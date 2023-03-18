const path = require('path')
const multer = require('multer')


module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: function(req, file, cb){
        let exp = path.extname(file.originalname)
        if(exp !== ".jpeg" && exp !== ".png" && exp !== ".jpg"){
            cb(new Error('File type not supported'), false)
            return;
        }else{
            cb(null, true)
        }
    }
})