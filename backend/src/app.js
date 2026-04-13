import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import productsRouter from "./routes/products.router.js";
import categoriesRouter from "./routes/categories.router.js";
import contactRouter from "./routes/contact.router.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandlers.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((item) => item.trim()),
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "API de tienda de ropa funcionando correctamente.",
    });
  });

  app.use("/api/products", productsRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/contact", contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
