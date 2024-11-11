import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
console.log(uri);

if (!uri) throw new Error("Database uri is missing");

export const dbConnect = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("db connection failed: ", error.message);
    });
};
