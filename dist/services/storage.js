"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUploadedFile = exports.getPostImageUploadStorageService = void 0;
var path_1 = __importDefault(require("path"));
var multer_1 = __importDefault(require("multer"));
var getPostImageUploadStorageService = function () {
    var storage = multer_1.default.diskStorage({
        destination: function (request, file, callback) {
            callback(null, "uploads/");
        },
        // By default, multer removes file extensions so let's add them back
        filename: function (request, file, callback) {
            callback(null, file.image + "-" + Date.now() + path_1.default.extname(file.originalname));
        },
    });
};
exports.getPostImageUploadStorageService = getPostImageUploadStorageService;
function saveUploadedFile(request, response, nameOfFormField, storage) {
    var upload = multer_1.default({ storage: storage, fileFilter: imageFilter }).single(nameOfFormField);
    return new Promise(function (resolve, reject) {
        upload(request, response, function (error) {
            if (request.fileValidationError) {
                var validationError = request.fileValidationError;
                return reject(validationError);
            }
            if (!request.file) {
                return reject("Please select an image to upload");
            }
            if (error) {
                return reject(error);
            }
            resolve(request.file.path);
        });
    });
}
exports.saveUploadedFile = saveUploadedFile;
function imageFilter(request, file, callback) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        request.fileValidationError = "Only image files are allowed!";
        return callback(new Error("Only image files are allowed!"), false);
    }
    callback(null, true);
}
exports.imageFilter = imageFilter;
