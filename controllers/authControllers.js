import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

import { signUp, findUser, updateUser } from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

const registerUser = ctrlWrapper(async (req, res) => {
	const newUser = await signUp(req.body);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
});

const logIn = ctrlWrapper(async (req, res) => {
	const { email, password } = req.body;

	const user = await findUser({ email });

	const comparePassword = await bcrypt.compare(password, user.password);

	if (!user || !comparePassword) {
		throw HttpError(401, "Email or password is wrong");
	}

	const { JWT_SECRET } = process.env;

	const payload = {
		id: user.id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

	const renewedUser = await updateUser({ email }, { token });

	res.status(200).json({
		token: renewedUser.token,
		user: {
			email: renewedUser.email,
			subscription: renewedUser.subscription,
		},
	});
});

const logOut = ctrlWrapper(async (req, res) => {
	const { id } = req.user;
	await updateUser({ id }, { token: " " });

	res.status(204).json({ message: "No Content" });
});

const getCurrent = ctrlWrapper(async (req, res) => {
	const { email, subscription } = req.user;

	res.status(200).json({
		email,
		subscription,
	});
});

const changeSubscription = ctrlWrapper(async (req, res) => {
	const { id } = req.user;
	const { favorite } = req.body;

	const updatedSubscription = await updateUser({ id }, { favorite });

	res.status(200).json({
		user: {
			email: updatedSubscription.email,
			subscription: updatedSubscription.subscription,
		},
	});
});

export { registerUser, logIn, logOut, getCurrent, changeSubscription };
