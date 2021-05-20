import datalize from "datalize";
import { ValidationPayload, ValidationRule, ValidationCollection, ValidationSource } from "../types";
import {
	VALIDATION_RULE_EMAIL,
	VALIDATION_RULE_NUMBER,
	VALIDATION_RULE_REQUIRED,
	VALIDATION_SOURCE_POST,
	VALIDATION_SOURCE_GET,
	VALIDATION_SOURCE_PARAMS,
} from "../constants";

const field = datalize.field;

export const validateData = (dataToValidate: ValidationPayload, source: ValidationSource) => {
	let allValidationRulesNeeded: ValidationCollection = {};

	Object.keys(dataToValidate).forEach((fieldName) => {
		let fieldValidationRules = dataToValidate[fieldName];

		fieldValidationRules.forEach((validationRule: ValidationRule) => {
			if (allValidationRulesNeeded[validationRule] == undefined) {
				allValidationRulesNeeded[validationRule] = [];
			}

			allValidationRulesNeeded[validationRule].push(fieldName);
		});
	});

	let validationHandlers: Array<any> = [];

	Object.keys(allValidationRulesNeeded).forEach((validationRule) => {
		let validationHandler = getValidationHandler(allValidationRulesNeeded, validationRule as ValidationRule);
		validationHandlers = validationHandlers.concat(validationHandler);
	});

	return compileValidationRules(source, validationHandlers);
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

function compileValidationRules(source: ValidationSource, validationHandlers: Array<any>) {
	if (source == VALIDATION_SOURCE_POST) {
		return datalize(validationHandlers);
	}

	if (source == VALIDATION_SOURCE_GET) {
		return datalize.query(validationHandlers);
	}

	if (source == VALIDATION_SOURCE_PARAMS) {
		return datalize.params(validationHandlers);
	}
}
