export interface User {
	firstname: string;
	lastname: string;
	email: string;
	id?: Number;
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
