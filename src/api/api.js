import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST
// Aqui é onde o token JWT vai entrar futuramente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE
// Trata erros globais automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado ou inválido → redireciona pro login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.error("Sem permissão para acessar este recurso.");
    }

    if (status === 500) {
      console.error("Erro interno no servidor.");
    }

    return Promise.reject(error);
  }
);

export default api;