import { sendError } from "../utils/apiResponse.js";

export const notFoundHandler = (req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: "Ruta no encontrada.",
    meta: {
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return sendError(res, {
    statusCode: error.statusCode || 500,
    message: error.message || "Error interno del servidor.",
    errors: error.errors || null,
  });
};
