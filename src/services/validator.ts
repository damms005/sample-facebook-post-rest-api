import express from "express";
import { body, query, param, validationResult, ValidationChain } from "express-validator";
import { ValidationPayload, ValidationRule, ValidationSource } from "../types";
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
	let inputFieldsToValidate = Object.keys(dataToValidate);

	inputFieldsToValidate.forEach((inputFieldName) => {
		let validationRulesForInputField = dataToValidate[inputFieldName];
		let validationChain: ValidationChain = getValidatorChain(source, inputFieldName, validationRulesForInputField);

		compiledValidationRules.push(validationChain);
	});

	return runValidations(compiledValidationRules);
};

function getValidatorChain(source, inputFieldName, validationRulesForInputField): ValidationChain {
	let validationChain: ValidationChain = bootValidationChain(source, inputFieldName) as ValidationChain;

	validationRulesForInputField.forEach((validationRule: ValidationRule) => {
		if (validationRule == VALIDATION_RULE_REQUIRED) {
			validationChain = validationChain
				.exists()
				.withMessage(`'${inputFieldName}' is required`)
				.notEmpty()
				.withMessage(`'${inputFieldName}' cannot be empty`);
		}

		if (validationRule == VALIDATION_RULE_EMAIL) {
			validationChain = validationChain.normalizeEmail().isEmail().withMessage(`'${inputFieldName}' must be a valid email`);
		}

		if (validationRule == VALIDATION_RULE_NUMBER) {
			validationChain = validationChain.isNumeric().withMessage(`'${inputFieldName}' Must be a number`);
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

function runValidations(validations: Array<ValidationChain>) {
	return async (request: express.Request, result: express.Response, next) => {
		await Promise.all(validations.map((validation) => validation.run(request)));

		const errors = validationResult(request);
		if (errors.isEmpty()) {
			return next();
		}

		result.status(400).json({
			errors: errors.array(),
		});
	};
}
