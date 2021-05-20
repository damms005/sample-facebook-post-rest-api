import sendgridMail from "@sendgrid/mail";
import { join } from "path";
import { reportError } from './error_reporting';

const edge = require("edge.js").default;
edge.mount(join(__dirname, "../views"));

const MAIL_PROCESSING_DELAY_IN_MILLISECONDS = 1000;

/**
 * Use timeout to send emails, so that normal request flow is
 * not slowed-down by the overhead of sending email
 */
export const sendEmail = (recipientEmail: string, subject: string, mailBodyHtml: string) => {
	setTimeout(() => {
		processEmail(recipientEmail, subject, mailBodyHtml);
	}, MAIL_PROCESSING_DELAY_IN_MILLISECONDS);
};

export function getEmailHtmlTemplate(viewName: string, parameters: any): Promise<string> {
	return new Promise((resolve, reject) => {
		edge
			.render(viewName, { ...parameters })
			.then((html) => {
				resolve(html);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function processEmail(recipientEmail: string, subject: string, mailBodyHtml: string) {
	sendgridMail.setApiKey(process.env.SENDGRID_API_KEY as any);

	const mail: any = {
		from: process.env.TWILIO_VERIFIED_SENDER_EMAIL,
		to: recipientEmail,
		subject,
		html: mailBodyHtml,
	};

	sendgridMail
		.send(mail)
		.then((response) => {})
		.catch((error) => {
			reportError(error);
		});
}
