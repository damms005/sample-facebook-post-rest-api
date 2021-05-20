import path from "path";
import multer from "multer";

export const getPostImageUploadStorageService = () => {
	const storage = multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, "uploads/");
		},

		// By default, multer removes file extensions so let's add them back
		filename: function (request, file, callback) {
			callback(null, file.image + "-" + Date.now() + path.extname(file.originalname));
		},
	});
};

export function saveUploadedFile(request, response, nameOfFormField: string, storage: any): Promise<any> {
	let upload = multer({ storage, fileFilter: imageFilter }).single(nameOfFormField);

	return new Promise((resolve, reject) => {
		upload(request, response, function (error) {
			if (request.fileValidationError) {
				let validationError = request.fileValidationError;
				return reject(validationError);
			}

			if (!request.file) {
				//No image was uploaded
				return resolve(undefined);
			}

			if (error) {
				return reject(error);
			}

			resolve(request.file.path);
		});
	});
}

function imageFilter(request, file, callback) {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		request.fileValidationError = "Only image files are allowed!";
		return callback(new Error("Only image files are allowed!"), false);
	}
	callback(null, true);
}
exports.imageFilter = imageFilter;
