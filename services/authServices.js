import bcrypt from "bcrypt";
import Users from "../db/models/Users.js";

const signUp = async (data) => {
	try {
		const { password } = data;
		const hashPassword = await bcrypt.hash(password, 10);
		return await Users.create({ ...data, password: hashPassword });
	} catch (error) {
		if (error?.parent?.code === "23505") {
			error.message = "Email in use";
		}
		throw error;
	}
};

const findUser = (query) =>
	Users.findOne({
		where: query,
	});

const updateUser = async (query, data) => {
	const updatedUser = await Users.update(data, {
		where: query,
	});

	return updatedUser ? await findUser(query) : null;
};

export { signUp, findUser, updateUser };
