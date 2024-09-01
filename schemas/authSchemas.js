import Joi from "joi";
import { emailRegexp } from "../constants/constants.js";

export const registerSchema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(emailRegexp).required(),
	subscription: Joi.string().optional(),
	avatarURL: Joi.string(),
});

export const mailSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
});

export default { registerSchema, mailSchema };
