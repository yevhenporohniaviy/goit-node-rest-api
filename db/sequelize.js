import "dotenv/config";
import { Sequelize } from "sequelize";

const {
	DATABASE_NAME,
	DATABASE_USER,
	DATABASE_PASSWORD,
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_DIALECT,
} = process.env;

const sequelize = new Sequelize({
	database: DATABASE_NAME,
	username: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: DATABASE_PORT,
	dialect: DATABASE_DIALECT,
	dialectOptions: {
		ssl: true,
	},
});

export default sequelize;
