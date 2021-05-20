"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./routes/auth"));
var posts_1 = __importDefault(require("./routes/posts"));
var post_likes_1 = __importDefault(require("./routes/post_likes"));
var post_replies_1 = __importDefault(require("./routes/post_replies"));
require("dotenv").config();
var app = express_1.default();
var PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/************************************************************
 ******* S T A R T:  R O U T E  D E F I N I T I O N S *******
 ************************************************************/
app.use("/v1/auth", auth_1.default);
app.use("/v1/posts", posts_1.default);
app.use("/v1/post_likes", post_likes_1.default);
app.use("/v1/post_replies", post_replies_1.default);
/************************************************************
 ********* E N D:  R O U T E  D E F I N I T I O N S *********
 ************************************************************/
app.listen(PORT, function () { return console.log("Server running on port: http://localhost:" + PORT); });
/*
-hot reload
*/
/*
1. Efficacy of your submission: Fundamentally how well your solution is able to achieve the assignment objective and solve the stated problem.
2. System Design: How well your application will perform at scale
3. Code quality
    a. Code modularity
    b. Code documentation - balancing between self-documenting code and comments
    c. Unit and integration testing
    d. Adherence to REST standards
3. Documentation: Readme and Postman/Swagger
*/
/*
Next stage:
-implement token refresh
-registration should ensure email unique
-reduce collision in image uploads by including user ID in filename
*/
