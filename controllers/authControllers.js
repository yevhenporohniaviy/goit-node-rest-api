import gravatar from "gravatar";
import path from "node:path";
import * as fs from "node:fs/promises";
import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllContacts } from "../services/contactsServices.js";

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res, next) => {
	try {
		const { subscription = "starter", ...userData } = req.body;
		const gravatarUrl = gravatar.url(
			userData.email,
			{
				s: "100",
				r: "pg",
				d: "identicon",
			},
			true
		);

		const newUser = await authServices.register({
			...userData,
			subscription,
			avatarURL: gravatarUrl,
		});

		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		if (error?.message === "Email in use") {
			return res.status(409).json({ message: error.message });
		}
		next(error);
	}
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await authServices.findUser({ verificationToken });
	if (!user) {
		throw HttpError(404, "User not found");
	}

	await authServices.updateUser(
		{ verificationToken },
		{
			verify: true,
			verificationToken: null,
		}
	);

	res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
	const { email } = req.body;
	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(404, "Email not found");
	}
	if (user.verify) {
		throw HttpError(400, "Verification has already been passed");
	}

	await authServices.sendVerifyMail(user.email, user.verificationToken);

	res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(401, "Email is wrong");
	}
	if (!user.verify) {
		throw HttpError(401, "Email not verified");
	}
	const passwordCompare = await bcryptjs.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Password is wrong");
	}

	const { id, subscription, avatarURL } = user;
	const payload = { id };
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
	await authServices.updateUser({ id }, { token });

	res.json({
		token,
		user: { email, subscription, avatarURL },
	});
};

const logout = async (req, res) => {
	const { id } = req.user;
	await authServices.updateUser({ id }, { token: "" });

	res.status(204).end();
};

const getCurrent = async (req, res) => {
	const { id, email, subscription, avatarURL } = req.user;
	const contacts = await getAllContacts({ owner: id });

	res.json({
		email,
		subscription,
		avatarURL,
		contacts,
	});
};

const changePlan = async (req, res, next) => {
	const { user } = req;
	const { subscription } = req.body;

	if (!["starter", "pro", "business"].includes(subscription)) {
		return next(HttpError(400, "Invalid subscription plan"));
	}

	try {
		const updatedUser = await authServices.updateUser(
			{ id: user.id },
			{ subscription }
		);

		if (!updatedUser) {
			return next(HttpError(404, "User not found"));
		}

		res.json({
			email: updatedUser.email,
			subscription: updatedUser.subscription,
		});
	} catch (error) {
		next(HttpError(401, error.message));
	}
};

const updateURL = async (req, res, next) => {
	try {
		const { id: user } = req.user;
		const { path: oldPath, filename } = req.file;
		const newPath = path.join(avatarsPath, filename);
		await fs.rename(oldPath, newPath);
		const avatarURL = path.join("avatars", filename);
		const updatedStatus = await authServices.updateUser(
			{ id: user },
			{ avatarURL }
		);
		res.json({ avatarURL: updatedStatus.avatarURL });
	} catch (error) {
		next(error);
	}
};

export default {
	register: ctrlWrapper(register),
	verify: ctrlWrapper(verify),
	resendVerify: ctrlWrapper(resendVerify),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	getCurrent: ctrlWrapper(getCurrent),
	changePlan: ctrlWrapper(changePlan),
	updateURL: ctrlWrapper(updateURL),
};
