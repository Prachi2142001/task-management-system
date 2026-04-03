const BASE_URL = "http://localhost:5000";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return !!(accessToken || refreshToken);
};
export const apiFetch = async (url: string, options: any = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      return fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
    } else {
      logout();
      window.location.href = "/auth/login";
    }
  }

  return res;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error();

    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
