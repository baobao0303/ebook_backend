import { UserDoc } from "@/models/user";
import { Response } from "express";
interface ErrorResponseType {
  res: Response;
  message: string;
  status: number;
}

export function sendErrorResponse({ res, message, status }: ErrorResponseType) {
  res.status(status).json({
    message,
  });
}

export const formatUserProfile = (user: UserDoc) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.role,
  };
};
