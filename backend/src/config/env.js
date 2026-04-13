import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 8080,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ropa_store",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  FRONTEND_API_BASE_URL: process.env.FRONTEND_API_BASE_URL || "http://localhost:8080/api",
  FRONTEND_WHATSAPP_NUMBER: process.env.FRONTEND_WHATSAPP_NUMBER || "5491112345678",
};
