import { RequestHandler } from "express";
import { z, ZodRawShape } from "zod";

export const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is missing",
      invalid_type_error: "Invalid email type!", // "email": true
    })
    .email("Invalid email!"), // "email":"admin@gmail.com"
};
export const newUserSchema = {
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
};
export const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
  return (req, res, next) => {
    const schema = z.object(obj);
    const result = schema.safeParse(req.body);
    console.log(result);
    if (result.success) {
      req.body = result.data;
    } else {
      console.log(JSON.stringify(result));
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
    next();
  };
};
