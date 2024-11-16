import mongoose from "mongoose";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ebook_collection";

export const dbConnect = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err.message);
    });
};
