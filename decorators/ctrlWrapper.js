import { ValidationError } from "sequelize";
import HttpError from "../helpers/HttpError.js";

export const ctrlWrapper = (controller) => {
	return async (req, res, next) => {
		try {
			await controller(req, res, next);
		} catch (error) {
			if (error?.parent?.code === "23505") {
				return next(HttpError(409, error.message));
			}
			if (error instanceof ValidationError) {
				return next(HttpError(400, error.message));
			}
			next(error);
		}
	};
};

ctrlWrapper
