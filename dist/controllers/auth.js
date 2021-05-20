"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = exports.finalizePasswordResetToken = exports.resetPassword = exports.login = exports.register = void 0;
var auth_1 = require("../services/auth");
var users_1 = require("../repositories/users");
var encryption_1 = require("../services/encryption");
var email_1 = require("../services/email");
var bcrypt_1 = __importDefault(require("bcrypt"));
var crypto_1 = __importDefault(require("crypto"));
var database_1 = require("../services/database");
var routing_1 = require("../services/routing");
var query_builder_1 = require("../services/query_builder");
var TOKEN_PASSWORD_SEPARATOR = "[:password:]";
var register = function (request, response) {
    var user = getUser(request);
    var password = request.body.password;
    encryption_1.encrypt(password)
        .then(function (encryptedPassword) {
        Promise.all([users_1.insert(__assign(__assign({}, user), { password: encryptedPassword })), auth_1.initializeSession(user)])
            .then(function (sessionToken) {
            sendRegistrationNotificationToUser(user.email);
            response.json({ message: "Registration successful", sessionToken: sessionToken });
        })
            .catch(function (error) { return response.json(__assign({ message: "User registration failed" }, error)); });
    })
        .catch(function () {
        console.log("Data encryption failed");
    });
};
exports.register = register;
var login = function (request, response) {
    var _a = request.body, email = _a.email, password = _a.password;
    users_1.findUserByEmail(email)
        .then(function (user) {
        bcrypt_1.default
            .compare(password, user.password)
            .then(function () {
            auth_1.initializeSession(user)
                .then(function (token) {
                response.json({ sessionToken: token });
            })
                .catch(function (error) { return response.json(__assign({ message: "User registration failed" }, error)); });
        })
            .catch(function (error) {
            response.status(400).json({ error: "Invalid login credentials. Please try again" });
        });
    })
        .catch(function (error) {
        response.status(401).json({ error: error });
    });
};
exports.login = login;
var resetPassword = function (request, response) {
    var _a = request.body, email = _a.email, newPassword = _a.newPassword;
    Promise.all([getToken(), encryption_1.encrypt(newPassword)])
        .then(function (_a) {
        var token = _a[0], encryptedNewPassword = _a[1];
        initiatePasswordReset(request, token, email, encryptedNewPassword)
            .then(function () {
            response.json({ message: "A link to reset your password has been sent to your email. Thank you" });
        })
            .catch(function (error) {
            response.status(403).json({ error: error });
        });
    })
        .catch(function (error) {
        response.status(500).json({ error: error });
    });
};
exports.resetPassword = resetPassword;
var finalizePasswordResetToken = function (request, response) {
    var token = request.params.token;
    users_1.findUser("password_reset_token", token)
        .then(function (queryResult) {
        var userId = queryResult["id"];
        var tokenExpiry = queryResult["password_reset_token_expires_at"];
        if (isExpiredToken(tokenExpiry)) {
            return response.status(503).json({ message: "Token expiry error" });
        }
        runPasswordUpdateDatabaseChanges(userId)
            .then(function () {
            response.json({ message: "Password update completed" });
        })
            .catch(function (error) {
            response.status(403).json(__assign({ message: "An error occurred" }, error));
        });
    })
        .catch(function (error) {
        response.status(401).json(__assign({ message: "Error: invalid token" }, error));
    });
};
exports.finalizePasswordResetToken = finalizePasswordResetToken;
function isExpiredToken(tokenExpiryTimestamp) {
    return Date.now() > tokenExpiryTimestamp;
}
function getToken() {
    return new Promise(function (resolve, reject) {
        crypto_1.default.randomBytes(20, function (error, buffer) {
            if (error) {
                return reject(error);
            }
            var token = buffer.toString("hex");
            resolve(token);
        });
    });
}
function initiatePasswordReset(request, token, email, encryptedNewPassword) {
    return new Promise(function (resolve, reject) {
        users_1.findUserByEmail(email)
            .then(function (user) {
            var tokenExpiry = Date.now() + 3600000; // 1 hour
            var query = getPasswordUpdateQuery();
            var bindings = [token, tokenExpiry.toString(), encryptedNewPassword, user.id.toString()];
            var sqlQuery = query_builder_1.buildQuery(query, bindings);
            database_1.executeQuery(sqlQuery)
                .then(function () {
                sendPasswordResetLinkToUser(request, user, token);
                resolve();
            })
                .catch(function (error) {
                reject(error);
                "";
            });
        })
            .catch(function (error) {
            reject(error);
        });
    });
}
function sendRegistrationNotificationToUser(recipientEmail) {
    var subject = "Facebook Post Service to the Moon 🚀🚀";
    var mailBodyPlainText = "Hello, Thanks for registering with us. 🤙";
    email_1.sendEmail(recipientEmail, subject, mailBodyPlainText);
}
function getUser(request) {
    var _a = request.body, firstname = _a.firstname, lastname = _a.lastname, email = _a.email;
    return { firstname: firstname, lastname: lastname, email: email };
}
function sendPasswordResetLinkToUser(request, user, token) {
    var parameters = {
        link: routing_1.getUrlFromPath(request, "/reset/" + token),
        user: user.firstname,
    };
    return new Promise(function (resolve, reject) {
        email_1.getEmailHtmlTemplate("password_reset", parameters)
            .then(function (htmlBody) {
            var subject = "Facebook Post: Password Reset";
            email_1.sendEmail(user.email, subject, htmlBody);
            resolve();
        })
            .catch(function (error) {
            reject(error);
        });
    });
}
/**
 * The encrypted password is stored temporarily. This ensures that
 * users will not be able to login until they click on an email confirmation link
 * so that it is not trivial to simply reset someone else's password via this API
 */
function getPasswordUpdateQuery() {
    return "UPDATE users SET \
	`password_reset_token` = ?, \
	`password_reset_token_expires_at` = ?, \
	`temporary_password` = ? \
	WHERE users.id = ?";
}
function runPasswordUpdateDatabaseChanges(userId) {
    return Promise.all([changePassword(userId), nullifyPasswordResetColumns(userId)]);
}
function changePassword(userId) {
    var query = query_builder_1.buildQuery("UPDATE users SET password = temporary_password WHERE user.id = ? ", [userId.toString()]);
    return database_1.executeQuery(query);
}
function nullifyPasswordResetColumns(userId) {
    var query = query_builder_1.buildQuery("UPDATE users SET \
		password_reset_token = NULL, \
		password_reset_token_expires_at = NULL, \
		temporary_password = NULL, \
		WHERE user.id = ? ", [userId.toString()]);
    return database_1.executeQuery(query);
}
function getAuthenticatedUser(request) {
    return new Promise(function (resolve, reject) {
        var userId = request.jwt.user_id;
        users_1.findUser("id", userId)
            .then(function (queryResult) {
            resolve({
                email: queryResult["email"],
                lastname: queryResult["lastname"],
                firstname: queryResult["firstname"],
            });
        })
            .catch(function (error) {
            reject(error);
        });
    });
}
exports.getAuthenticatedUser = getAuthenticatedUser;
