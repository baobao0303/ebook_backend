import { generateAuthLink, logout, sendProfileInfo, verifyAuthToken } from "@/controllers/auth";
import { isAuth } from "@/middlewares/auth";
import { emailValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";
import { Schema } from "zod";

const authRouter = Router();

// /auth/generate-link
authRouter.post("/generate-link", validate(emailValidationSchema), generateAuthLink);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.get("/logout", isAuth, logout);
export default authRouter;
