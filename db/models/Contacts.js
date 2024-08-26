import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Contacts = sequelize.define(
	'contact', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		favorite: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		owner: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}
);

Contacts.sync()

export default Contacts;
