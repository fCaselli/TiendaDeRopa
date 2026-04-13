const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value ?? "").trim();

export const validateContactPayload = (payload = {}) => {
  const normalized = {
    name: normalizeText(payload.name),
    email: normalizeText(payload.email).toLowerCase(),
    subject: normalizeText(payload.subject),
    message: normalizeText(payload.message),
  };

  const errors = {};

  if (!normalized.name) {
    errors.name = "El nombre es obligatorio.";
  } else if (normalized.name.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  } else if (normalized.name.length > 80) {
    errors.name = "El nombre no puede superar los 80 caracteres.";
  }

  if (!normalized.email) {
    errors.email = "El email es obligatorio.";
  } else if (!EMAIL_REGEX.test(normalized.email)) {
    errors.email = "El email no tiene un formato válido.";
  } else if (normalized.email.length > 120) {
    errors.email = "El email no puede superar los 120 caracteres.";
  }

  if (!normalized.subject) {
    errors.subject = "El asunto es obligatorio.";
  } else if (normalized.subject.length < 3) {
    errors.subject = "El asunto debe tener al menos 3 caracteres.";
  } else if (normalized.subject.length > 120) {
    errors.subject = "El asunto no puede superar los 120 caracteres.";
  }

  if (!normalized.message) {
    errors.message = "El mensaje es obligatorio.";
  } else if (normalized.message.length < 10) {
    errors.message = "El mensaje debe tener al menos 10 caracteres.";
  } else if (normalized.message.length > 2000) {
    errors.message = "El mensaje no puede superar los 2000 caracteres.";
  }

  return {
    normalized,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
