import "dotenv/config";
import "express-async-errors";
import "@/db/connect";
import express from "express";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 8989;
// MIDDLEWARES
app.use(express.json());
// app.use((req, res, next) => {
//   // NO USE MIDDLES RENDER JSON
//   req.on("data", (chuck) => {
//     // console.log(chuck);
//     req.body = JSON.parse(chuck.toString());
//     next();
//   });
// });
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
//routes-middleware-function handler
app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
