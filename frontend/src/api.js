import { API_BASE_URL } from "./config";

export async function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    const response = await apiFetch("/auth/verify");
    return !!response.user;
  } catch (error) {
    // Token is invalid or expired
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return false;
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

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
