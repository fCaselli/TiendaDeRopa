export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Ocurrió un error inesperado.");
    error.details = data?.errors || null;
    error.status = response.status;
    throw error;
  }

  return data;
}
