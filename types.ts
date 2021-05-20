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

export type ValidationRule = "email" | "required" | "number";

export type ValidationSource = "post" | "get" | "params";
export interface ValidationPayload {
	[inputFieldName: string]: Array<ValidationRule>;
}

export interface ValidationCollection {
	[rule: string]: Array<string>;
}
