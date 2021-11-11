const multer = require("multer");
const path = require("path");

//==============multer configurations===============
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
//initialize the file uplaod
const upload = multer({ storage });

module.exports = upload;
