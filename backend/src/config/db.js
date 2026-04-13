import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};
