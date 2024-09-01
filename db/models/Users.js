import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import { emailPatterValidation } from "../../constants/constants.js";

const Users = sequelize.define("user", {
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			is: emailPatterValidation,
		},
	},
	subscription: {
		type: DataTypes.ENUM,
		values: ["starter", "pro", "business"],
		defaultValue: "starter",
	},
	token: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
	avatarURL: {
		type: DataTypes.STRING,
	},
});

Users.sync()


export default Users;
