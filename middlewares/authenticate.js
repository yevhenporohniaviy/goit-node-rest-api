import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";

const authenticate = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return next(HttpError(401, "Authorization header missing"));
	}

	const [bearer, token] = authorization.split(" ");

	if (bearer !== "Bearer") {
		return next(HttpError(401, "Bearer missing"));
	}

	const { JWT_SECRET } = process.env;

	try {
		const { id } = jwt.verify(token, JWT_SECRET);

		const user = await findUser({ id });

		if (!user) {
			return next(HttpError(401, "Not authorized"));
		}

		if (!token || token !== user.token) {
			return next(HttpError(401, "Not authorized"));
		}

		req.user = user;
		next();
	} catch (error) {
		next(HttpError(401, "Not authorized"));
	}
};

export default authenticate;
