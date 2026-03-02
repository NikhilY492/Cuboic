import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// In Expo Go on a device, use your machine's LAN IP, not localhost.
// e.g. http://192.168.1.x:3000
const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 12_000,
});

// Attach JWT token to every request
api.interceptors.request.use(async config => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
export { BASE_URL };
