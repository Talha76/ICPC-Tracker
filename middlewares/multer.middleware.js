const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  }
});

const fileFilter = (req, file, cb) => {
  const validMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    // audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/x-pn-wav",
    "audio/webm",
    "audio/ogg",
    // video
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/webm",
    "video/3gpp",
    "video/3gpp2",
    "video/x-msvideo",
    "video/x-flv",
    "video/x-m4v",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-ms-asf",
    "video/x-ms-wmv",
    "video/x-msvideo"
  ]
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;

