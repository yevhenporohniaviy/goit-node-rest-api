import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";
import User from "../db/models/Users.js";
import sendMail from "../helpers//sendMail.js";

const { BASE_URL } = process.env;

export const findUser = (query) => User.findOne({ where: query });

export const updateUser = async (query, data) => {
	const user = await findUser(query);
	if (!user) {
		return null;
	}
	return user.update(data, { returning: true });
};

export const sendVerifyMail = (email, verificationToken) => {
	const verifyMail = {
		to: email,
		subject: "Verify email",
		html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
	};

	return sendMail(verifyMail);
};

export const register = async (data) => {
	try {
		const { password } = data;
		const hashPassword = await bcryptjs.hash(password, 10);
		const verificationToken = nanoid();
		const newUser = await User.create({
			...data,
			password: hashPassword,
			verificationToken,
		});

		await sendVerifyMail(data.email, verificationToken);

		return newUser;
	} catch (error) {
		if (error?.parent?.code === "23505") {
			error.message = "Email in use";
		}
		throw error;
	}
};
