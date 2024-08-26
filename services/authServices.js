import bcrypt from "bcrypt";
import UserData from "../db/models/Users.js";
import gravatar from "gravatar";

const signUp = async (data) => {
	try {
		const { password, email } = data;
		const hashPassword = await bcrypt.hash(password, 10);
		const avatarURL = gravatar.url(email, { protocol: "https" });
		return await UserData.create({
			...data,
			password: hashPassword,
			avatarURL,
		});
	} catch (error) {
		if (error?.parent?.code === "23505") {
			error.message = "Email in use";
		}
		throw error;
	}
};

const findUser = (query) =>
	UserData.findOne({
		where: query,
	});

const updateUser = async (query, data) => {
	const updatedUser = await UserData.update(data, {
		where: query,
	});

	return updatedUser ? await findUser(query) : null;
};

export { signUp, findUser, updateUser };
