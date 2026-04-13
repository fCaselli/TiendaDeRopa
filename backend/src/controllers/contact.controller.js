import Contact from "../models/Contact.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { validateContactPayload } from "../utils/validators.js";

export const sendContactForm = async (req, res, next) => {
  try {
    const { normalized, errors, isValid } = validateContactPayload(req.body);

    if (!isValid) {
      return sendError(res, {
        statusCode: 400,
        message: "Hay errores de validación en el formulario de contacto.",
        errors,
      });
    }

    const newContact = await Contact.create(normalized);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Consulta enviada correctamente.",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};
