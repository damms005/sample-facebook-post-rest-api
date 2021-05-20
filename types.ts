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
