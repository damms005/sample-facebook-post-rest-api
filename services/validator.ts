import { body, query, param, validationResult, ValidationChain } from "express-validator";
import { ValidationPayload, ValidationRule, ValidationRuleInputFieldMap, ValidationSource } from "../types";
import {
	VALIDATION_RULE_EMAIL,
	VALIDATION_RULE_NUMBER,
	VALIDATION_RULE_REQUIRED,
	VALIDATION_SOURCE_POST,
	VALIDATION_SOURCE_GET,
	VALIDATION_SOURCE_PARAMS,
} from "../constants";

export const validate = (dataToValidate: ValidationPayload, source: ValidationSource) => {
	let rulesInputFieldMap: ValidationRuleInputFieldMap = {};

	Object.keys(dataToValidate).forEach((fieldName) => {
		let fieldValidationRules = dataToValidate[fieldName];

		fieldValidationRules.forEach((validationRule: ValidationRule) => {
			if (rulesInputFieldMap[validationRule] == undefined) {
				rulesInputFieldMap[validationRule] = [];
			}

			rulesInputFieldMap[validationRule].push({[fieldName]:});
		});
	});

	let validationHandlers: Array<any> = [];

	Object.keys(rulesInputFieldMap).forEach((validationRule) => {
		let validationHandler = getValidationHandler(rulesInputFieldMap, validationRule as ValidationRule);
		validationHandlers = validationHandlers.concat(validationHandler);
	});
	let compiledValidationRules = compileValidationRules(source, validationHandlers);

	return compiledValidationRules;
};

const _validate = (validations) => {
	return async (request, response, next) => {
		await Promise.all(validations.map((validation) => validation.run(request)));

		const errors = validationResult(request);
		if (errors.isEmpty()) {
			return next();
		}

		response.status(400).json({
			errors: errors.array(),
		});
	};
};

function getValidationHandler(allValidationRulesNeeded, validationRule: ValidationRule): Array<any> {
	let validationHandlers: Array<any> = [];

	let inputFields = allValidationRulesNeeded[validationRule];
	inputFields.forEach((inputField) => {
		if (validationRule == VALIDATION_RULE_REQUIRED) {
			validationHandlers.push(field(inputField, inputField).trim().required());
			return;
		}

		if (validationRule == VALIDATION_RULE_EMAIL) {
			validationHandlers.push(field(inputField, inputField).trim().email());
			return;
		}

		if (validationRule == VALIDATION_RULE_NUMBER) {
			validationHandlers.push(field(inputField, inputField).trim().number());
			return;
		}
	});

	return validationHandlers;
}

function compileValidationRules(source: ValidationSource, validationHandlers: Array<any>): ValidationChain | undefined {
	if (source == VALIDATION_SOURCE_POST) {
		return body(validationHandlers);
	}

	if (source == VALIDATION_SOURCE_GET) {
		return query(validationHandlers);
	}

	if (source == VALIDATION_SOURCE_PARAMS) {
		return param(validationHandlers);
	}
}





















export const __validate = (dataToValidate: ValidationPayload, source: ValidationSource) => {
	let compiledValidationRules: Array<ValidationChain> = {} as any;

	Object.keys(dataToValidate).forEach((fieldName) => {
		let fieldValidationRules = dataToValidate[fieldName];

		fieldValidationRules.forEach((validationRule: ValidationRule) => {
			if (compiledValidationRules[validationRule] == undefined) {
				compiledValidationRules[validationRule] = [];
			}

			compiledValidationRules[validationRule].push({[fieldName]:});
		});
	});

	let validationHandlers: Array<any> = [];

	Object.keys(compiledValidationRules).forEach((validationRule) => {
		let validationHandler = getValidationHandler(compiledValidationRules, validationRule as ValidationRule);
		validationHandlers = validationHandlers.concat(validationHandler);
	});

	return compiledValidationRules;
}

function startValidationChain(source: ValidationSource,inputFieldName:string):ValidationChain|undefined {
	if (source == VALIDATION_SOURCE_POST) {
		return   body(inputFieldName).isEmail();
	}

	if (source == VALIDATION_SOURCE_GET) {
		return query(inputFieldName).trim();
	}

	if (source == VALIDATION_SOURCE_PARAMS) {
		return param(inputFieldName).trim();
	}
}