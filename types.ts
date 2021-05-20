export interface User {
	id?: Number;
	email: string;
	firstname: string;
	lastname: string;
	password?: string;
	password_reset_token_expires_at?: string;
}

export interface SqlQuery {
	query: string;
	bindings?: Array<string>;
	isValid: boolean;
}

export type ValidationSource = "post" | "get" | "params";

export type ValidationRule = "email" | "required" | "number";
export interface ValidationPayload {
	[inputFieldName: string]: Array<ValidationRule>;
}

export interface ValidationRuleInputFieldMap {
	[rule: string]: Array<string>;
}
