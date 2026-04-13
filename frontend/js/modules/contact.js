import { apiFetch } from "./api.js";
import { CONTACT_API_URL } from "./config.js";
import { elements } from "./dom.js";
import { clearFieldErrors, setFieldError, showToast } from "./ui.js";

export async function handleContactSubmit(e) {
  e.preventDefault();
  clearFieldErrors(elements.contactForm);

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  const submitButton = elements.contactForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  try {
    await apiFetch(CONTACT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    showToast("Consulta enviada con éxito");
    elements.contactForm.reset();
  } catch (error) {
    if (error.details) {
      Object.entries(error.details).forEach(([field, message]) => {
        const input = document.getElementById(field);
        if (input) setFieldError(input, message);
      });
    }
    showToast(error.message || "No se pudo enviar la consulta");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}
