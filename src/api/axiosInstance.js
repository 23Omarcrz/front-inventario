import axios from 'axios';

// Creamos un nuevo axios instance
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    timeout: 15000
});

// Flag para evitar múltiples refresh al mismo tiempo
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Solo interceptamos si es 401 y NO es login
        const isAuthError = error.response?.data?.code === "INVALID_USER_OR_PASSWORD";

        // Si recibimos 401
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthError) {
            if (isRefreshing) {
                // Si ya se está refrescando, guardamos la request en la cola
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest))
                  .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Llamamos a /refresh para obtener nuevo access token
                await axios.post('/api/auth/refresh', {}, { withCredentials: true });
                
                processQueue(null);

                return api(originalRequest); // Reintentamos la request original
            } catch (err) {
                processQueue(err, null);
                // Opcional: logout automático si no se puede refrescar
                localStorage.removeItem('admin');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
