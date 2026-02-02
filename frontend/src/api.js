import { API_BASE_URL } from "./config";

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    const error = (data && data.message) || res.statusText;
    throw new Error(error);
  }
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
