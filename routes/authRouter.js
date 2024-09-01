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
	updateAvatar,
} from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

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

authRouter.patch(
	"/avatars",
	upload.single("avatar"),
	authenticate,
	updateAvatar,
);

export default authRouter;
