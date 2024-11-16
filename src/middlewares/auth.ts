import UserModel from "@/models/user";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name?: string;
        email: string;
        role: "user" | "author";
      };
    }
  }
}

const schema = z.object({
  email: z
    .string({
      required_error: "Email is missing",
    })
    .email("Zod says it is invalid!"),
});

export const emailValidationMiddleware: RequestHandler = (req, res, next) => {
  //   const { email } = req.body;
  //   const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

  //   if (!regex.test(email)) {
  //     // sending error response
  //     return res.status(422).json({ message: "Invalid email format" });
  //   }
  const result = schema.safeParse(req.body);
  console.log(result);

  if (!result.success) {
    console.log(JSON.stringify(result));
    const errors = result.error.flatten().fieldErrors;
    return res.status(422).json({ errors });
  }

  result.data.email;
  // john@email.com
  next();
};
export const isAuth: RequestHandler = async (req, res, next) => {
  const authToken = req.cookies.authToken;

  //sent error response if these is no token
  if (!authToken) {
    return sendErrorResponse({
      message: "Unauthorized request!",
      status: 401,
      res,
    });
  }

  //otherwise find out if the token is valid or signed by this same server
  const payload = jwt.verify(authToken, process.env.JWT_SECRET!) as {
    userId: string;
  };

  // if the token is valid find user from the payload
  // if the token us invalid it will throw error which we can handle
  // from inside the error middleware

  const user = await UserModel.findById(payload.userId);
  if (!user) {
    return sendErrorResponse({
      message: "Unauthorized request user not found!",
      status: 401,
      res,
    });
  }

  req.user = formatUserProfile(user);
  next();
};
