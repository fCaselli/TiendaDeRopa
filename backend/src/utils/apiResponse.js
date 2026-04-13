export const sendSuccess = (res, { statusCode = 200, message = "OK", data = null, meta = null } = {}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

export const sendError = (res, { statusCode = 500, message = "Error interno del servidor", errors = null, meta = null } = {}) => {
  const response = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};
