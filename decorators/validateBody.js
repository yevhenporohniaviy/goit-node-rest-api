import HttpError from "../helpers/HttpError.js";

const validateBody = (schema) => {
	const fn = (req, _, next) => {
		const { error } = schema.validate(req.body);
		if (error) {
			return next(HttpError(400, error.message));
		}
		next();
	};

	return fn;
};

export default validateBody;
