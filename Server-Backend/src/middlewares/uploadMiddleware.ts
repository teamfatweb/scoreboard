import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/', // Adjust the path as necessary
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limits file size to 1MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('avatar'); // 'avatar' is the name of the form field

// Check file type
function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
}

export { upload };

