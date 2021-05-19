export interface User {
	firstname: string;
	lastname: string;
	email: string;
}

export interface SqlQuery {
	query: string;
	bindings?: Array<string>;
	isValid: boolean;
}
