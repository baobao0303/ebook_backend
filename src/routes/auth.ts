import { generateAuthLink, logout, sendProfileInfo, updateProfile, verifyAuthToken } from "@/controllers/auth";
import { isAuth } from "@/middlewares/auth";
import { fileParser } from "@/middlewares/file";
import { emailValidationSchema, newUserSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authRoute = Router();

// write middlewares for emailValidation
// authRoute.get("/generate-link", emailValidationMiddleware, generateAuthLink);

// write middlewares for emailValidation equal library zod
authRoute.post("/generate-link", validate(emailValidationSchema), generateAuthLink);
authRoute.get("/verify", verifyAuthToken);
authRoute.get("/profile", isAuth, sendProfileInfo);
authRoute.post("/logout", isAuth, logout);
authRoute.put("/profile", isAuth, fileParser, validate(newUserSchema), updateProfile);
export default authRoute;
