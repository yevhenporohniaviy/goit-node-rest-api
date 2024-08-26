import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
	authSignUpSchemas,
	authSubscriptionSchemas,
} from "../schemas/authSchemas.js";
import {
	registerUser,
	logIn,
	logOut,
	getCurrent,
	changeSubscription,
} from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSignUpSchemas), registerUser);

authRouter.post("/login", validateBody(authSignUpSchemas), logIn);

authRouter.post("/logout", authenticate, logOut);

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch(
	"/subscription",
	authenticate,
	validateBody(authSubscriptionSchemas),
	changeSubscription,
);

export default authRouter;
