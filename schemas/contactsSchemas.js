import Joi from "joi";

export const createContactSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().min(10).max(20).required(),
});

export const updateContactSchema = Joi.object({
	name: Joi.string().min(3).max(50),
	email: Joi.string().email(),
	phone: Joi.string().min(10).max(20),
});

export const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});
