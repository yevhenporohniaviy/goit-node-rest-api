import HttpError from "./HttpError.js";

const EmptyRequestBodyError = (body) => {
	if (Object.keys(body).length === 0) {
		throw HttpError(400, "Body must have at least one field");
	}
};

export default EmptyRequestBodyError;
