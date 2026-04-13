import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const app = createApp();

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error al cerrar MongoDB:", error.message);
    }
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
