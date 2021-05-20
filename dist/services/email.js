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
exports.getEmailHtmlTemplate = exports.sendEmail = void 0;
var mail_1 = __importDefault(require("@sendgrid/mail"));
var path_1 = require("path");
require("dotenv").config();
var edge = require("edge.js").default;
edge.mount(path_1.join(__dirname, "views"));
var MAIL_PROCESSING_DELAY_IN_MILLISECONDS = 1000;
/**
 * Use timeout to send emails, so that normal request flow is
 * not slowed-down by the overhead of sending email
 */
var sendEmail = function (recipientEmail, subject, mailBodyHtml) {
    setTimeout(function () {
        processEmail(recipientEmail, subject, mailBodyHtml);
    }, MAIL_PROCESSING_DELAY_IN_MILLISECONDS);
};
exports.sendEmail = sendEmail;
function getEmailHtmlTemplate(viewName, parameters) {
    return new Promise(function (resolve, reject) {
        edge
            .render(viewName, __assign({}, parameters))
            .then(function (html) {
            resolve(html);
        })
            .catch(function (error) {
            reject(error);
        });
    });
}
exports.getEmailHtmlTemplate = getEmailHtmlTemplate;
function processEmail(recipientEmail, subject, mailBodyHtml) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    var mail = {
        from: process.env.TWILIO_VERIFIES_SENDER_EMAIL,
        to: recipientEmail,
        subject: subject,
        html: mailBodyHtml,
    };
    mail_1.default
        .send(mail)
        .then(function (response) {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    })
        .catch(function (error) {
        console.error(error);
    });
}
