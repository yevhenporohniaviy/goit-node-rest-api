import { ValidationError } from "sequelize";

const ctrlWrapper = (ctrl) => {
	const fn = async (req, res, next) => {
		try {
			await ctrl(req, res, next);
		} catch (error) {
			if (error instanceof ValidationError) {
				error.status = 400;
			}
			next(error);
		}
	};
	return fn;
};

export default ctrlWrapper;
