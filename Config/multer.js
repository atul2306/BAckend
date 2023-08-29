const multer = require("multer");
const path = require("path");
const { v1: uuid } = require("uuid");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "video/mp4": "mp4",
    "image/gif": "gif",
};

module.exports = multer({
    limits: 5000000000, // 50mb
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];

    
            cb(null, uuid() + "." + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        console.log(" isValid:", isValid);
        let error = isValid ? null : new Error("Invalid file type!");
        cb(error, isValid);
    },
});
