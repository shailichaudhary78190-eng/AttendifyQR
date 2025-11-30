// Auth store
// Purpose: Manage JWT auth state and pre-configured Axios client.
// Notes: Keeps token/user in localStorage to persist across refreshes.
import { create } from "zustand";
import axios from "axios";


const API_BASE = import.meta?.env?.VITE_API_URL;
const API = axios.create({ baseURL: API_BASE });

// Read any existing token once and attach to Axios headers
const storedToken = localStorage.getItem("token");
if (storedToken) {
  API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  // Log in: store token + user and prime Axios for authenticated requests
  login: async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  },
  register: async ({ role, email, password, name }) => {
    const { data } = await API.post("/auth/register", {
      role,
      email,
      password,
      name,
    });
    return data;
  },
  // Log out: clear local state and remove Authorization header
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
    delete API.defaults.headers.common["Authorization"];
  },
}));

export { API };
