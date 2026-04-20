import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL: API_URL });

// Auto attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aiTravelToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 403
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 403 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('aiTravelRefreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('aiTravelToken', data.data.token);
        localStorage.setItem('aiTravelRefreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.token}`;
        return api(original);
      } catch {
        localStorage.removeItem('aiTravelToken');
        localStorage.removeItem('aiTravelRefreshToken');
        localStorage.removeItem('aiTravelUser');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('aiTravelToken', data.data.token);
  localStorage.setItem('aiTravelRefreshToken', data.data.refreshToken);
  localStorage.setItem('aiTravelUser', JSON.stringify(data.data.user));
  return data.data.user;
};

export const signupUser = async (name, email, phone, password) => {
  const { data } = await api.post('/auth/register', { name, email, phone, password });
  localStorage.setItem('aiTravelToken', data.data.token);
  localStorage.setItem('aiTravelRefreshToken', data.data.refreshToken);
  localStorage.setItem('aiTravelUser', JSON.stringify(data.data.user));
  return data.data.user;
};

export const logoutUser = () => {
  localStorage.removeItem('aiTravelToken');
  localStorage.removeItem('aiTravelRefreshToken');
  localStorage.removeItem('aiTravelUser');
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data.data.user;
};

export const saveTrip = async (tripData) => {
  const { data } = await api.post('/trips/create', tripData);
  return data.data.trip;
};

export const getMyTrips = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/trips/my-trips?page=${page}&limit=${limit}`);
  return data.data;
};

export const deleteTrip = async (tripId) => {
  const { data } = await api.delete(`/trips/${tripId}`);
  return data;
};

export const updateTrip = async (tripId, updates) => {
  const { data } = await api.put(`/trips/${tripId}`, updates);
  return data.data.trip;
};

export default api;
