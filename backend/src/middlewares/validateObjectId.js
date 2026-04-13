import { sendError } from "../utils/apiResponse.js";
import { isValidObjectId } from "../utils/validateObjectId.js";

export const validateObjectIdParam = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];

  if (!isValidObjectId(value)) {
    return sendError(res, {
      statusCode: 400,
      message: "El id informado no es válido.",
      errors: {
        [paramName]: "Debe ser un ObjectId válido.",
      },
    });
  }

  next();
};
