import "dotenv/config";
import "express-async-errors";
import "@/db/connect";
import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import authRoute from "./routes/auth";
import { errorHandler } from "./middlewares/error";
import { fileParser } from "./middlewares/file";

const app = express();
///MIDDLEWARES
// middlewares convert buffer to json
// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(((error, req, res, next) => {
//   res.status(500).json({ message: error.message });
// }) as ErrorRequestHandler); --> need to try catch error
app.use(cookieParser());

// ROUTES

app.use("/auth", authRoute);
app.post("/test", fileParser, (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.json({});
});

//MIDDLEWARES ERROR
app.use(errorHandler);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
