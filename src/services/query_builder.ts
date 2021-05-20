import { SqlQuery } from "../types";

export const buildQuery = (query: string, bindings?: Array<string>): SqlQuery => {
	//more detailed check need to be done here. For now, we
	//simply check for non-zero query length
	let isValid = query.length > 0;

	return {
		query,
		bindings,
		isValid,
	};
};
