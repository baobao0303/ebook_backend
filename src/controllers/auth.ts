import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import VerificationTokenModel from "@/models/verificationTokenSchema";
import UserModel from "@/models/user";
import mail from "@/utils/mail";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import jwt from "jsonwebtoken";

export const generateAuthLink: RequestHandler = async (req, res) => {
  // Generate authentication link
  // and send that link to the users email address
  const { email } = req.body;
  let user = await UserModel.findOne({ email });

  if (!user) {
    // if no user found then create new user
    user = await UserModel.create({ email });
  }

  const userId = user._id.toString();
  // if we already have token for this user it will remove that first
  await VerificationTokenModel.findOneAndDelete({ userId });

  const randomToken = crypto.randomBytes(36).toString("hex");

  await VerificationTokenModel.create<{ userId: string }>({
    userId,
    token: randomToken,
  });

  const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`;

  await mail.sendVerificationMail({
    link,
    to: user.email,
  });

  res.json({ message: "Please check you email for link." });
};

export const verifyAuthToken: RequestHandler = async (req, res) => {
  // http://localhost:8989/auth/verify?token=c5154e6cfe712f76bcc87fce283c23a3b4d055c916b1a8536b5f8c9eead21c01c7de33ef&userId=6731a96b575eeb6b222b34bb
  const { token, userId } = req.query;

  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request!",
      res,
    });
  }

  const verificationToken = await VerificationTokenModel.findOne({ userId });
  if (!verificationToken || !verificationToken.compare(token)) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request, token mismatch!",
      res,
    });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong, user not found!",
      res,
    });
  }

  await VerificationTokenModel.findByIdAndDelete(verificationToken._id);

  // TODO: authentication
  const payload = { userId: user._id };
  //process.env.JWT_SECRET as string instead to process.env.JWT_SECRET!
  const authToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
  });
  // res.redirect(`${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`);
  res.send();
};

export const sendProfileInfo: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
};

export const logout: RequestHandler = (req, res) => {
  res.clearCookie("authToken").send();
  res.json({ message: "Logout successful!" });
};
