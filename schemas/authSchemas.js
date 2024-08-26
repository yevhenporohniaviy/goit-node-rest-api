import Joi from "joi";
import { emailPatterValidation } from "../constants/constants.js";

const authSignUpSchemas = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(emailPatterValidation).required(),
});

const authSubscriptionSchemas = Joi.object({
	favorite: Joi.string().valid("starter", "pro", "business").required(),
});

export { authSignUpSchemas, authSubscriptionSchemas };
