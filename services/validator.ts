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
	let compiledValidationRules: Array<ValidationChain> = [] as any;

	Object.keys(dataToValidate).forEach((inputFieldName) => {
		let validationRulesForInputField = dataToValidate[inputFieldName];

		let validationChain: ValidationChain = getValidatorChain(source, inputFieldName, validationRulesForInputField);

		compiledValidationRules.push(validationChain);
	});

	return compiledValidationRules;
};

function getValidatorChain(source, inputFieldName, validationRulesForInputField): ValidationChain {
	let validationChain: ValidationChain = bootValidationChain(source, inputFieldName) as ValidationChain;

	validationRulesForInputField.forEach((validationRule: ValidationRule) => {
		if (validationRule == VALIDATION_RULE_REQUIRED) {
			validationChain = validationChain.exists().notEmpty();
		}

		if (validationRule == VALIDATION_RULE_EMAIL) {
			validationChain = validationChain.isEmail();
		}

		if (validationRule == VALIDATION_RULE_NUMBER) {
			validationChain = validationChain.isNumeric();
		}
	});

	return validationChain;
}

function bootValidationChain(source: ValidationSource, inputFieldName: string): ValidationChain | undefined {
	if (source == VALIDATION_SOURCE_POST) {
		return body(inputFieldName).trim();
	}

	if (source == VALIDATION_SOURCE_GET) {
		return query(inputFieldName).trim();
	}

	if (source == VALIDATION_SOURCE_PARAMS) {
		return param(inputFieldName).trim();
	}
}
