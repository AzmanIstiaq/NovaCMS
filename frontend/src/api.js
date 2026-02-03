import { API_BASE_URL } from "./config";

export async function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    // Use /auth/me to validate the token and fetch user info
    const response = await apiFetch("/auth/me");
    return response?.user || null;
  } catch (error) {
    // Only clear if it's an auth error, not network error
    if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Unauthorized')) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return null;
    }
    // For network errors, assume token is still valid
    return null;
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
