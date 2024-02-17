

const multer = require('multer');

// image upload multer
const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
        console.log('Uploading file:', file.originalname);
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

module.exports = { upload };




