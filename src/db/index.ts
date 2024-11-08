import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGO_URI;
console.log("uri: ", uri);

if (!uri) throw new Error("Database uri is missing!");

export const dbConnect = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("db connected!");
    })
    .catch((error) => {
      console.log("db connection failed: ", error.message);
    });
};
