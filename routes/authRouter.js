import { Router } from "express";
import upload from "../middlewares/upload.js";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import { registerSchema, mailSchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authMiddleWare = validateBody(registerSchema);
const verifyMailMiddleWare = validateBody(mailSchema);

const authRouter = Router();

authRouter.post(
	"/register",
	upload.single("avatar"),
	authMiddleWare,
	authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post("/verify", verifyMailMiddleWare, authControllers.resendVerify);

authRouter.post("/login", authMiddleWare, authControllers.login);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.patch("/subscription", authenticate, authControllers.changePlan);

authRouter.patch(
	"/avatars",
	upload.single("avatar"),
	authenticate,
	authControllers.updateURL
);

export default authRouter;
