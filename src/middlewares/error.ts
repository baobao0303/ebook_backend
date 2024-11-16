import { ErrorRequestHandler } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof JsonWebTokenError) {
    return res.status(505).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
};
