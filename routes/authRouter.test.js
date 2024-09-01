import request from 'supertest';
import server from '../app.js';

describe("test post request to auth/login route", () => {
	const signinData = {
		email: "test@gmail.com",
		password: "qwerty12345",
	};

	let response = null;

	beforeAll(async () => {
		response = await request(server).post("/api/auth/login").send(signinData);
	});

	afterAll(() => {
		server.close();
	});

	test("response code 200", () => {
		const { status } = response;
		expect(status).toBe(200);
	});
	test("response has token", () => {
		const { body } = response;
		expect(body.token).toBeTruthy();
	});
	test("user has email and subscription with a data type string", () => {
		const { body } = response;
		expect(typeof body.user.email).toBe("string");
		expect(typeof body.user.subscription).toBe("string");
	});
});
