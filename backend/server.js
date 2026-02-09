import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
dotenv.config();

app.use(cors());
//parsing json request body
app.use(express.json()); 


app.use(userRoutes);
app.use(postRoutes);
app.use('/uploads', express.static('uploads'));


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    app.listen(5001, () => {
      console.log("Server is running on port 5001");
    });
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
};

start();
