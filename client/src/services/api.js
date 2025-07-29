import axios from 'axios';
import { getAuth } from 'firebase/auth';

const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api',
});

apiClient.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getSessions = () => apiClient.get('/sessions');
export const createSession = () => apiClient.post('/sessions');
export const generateCode = (sessionId, prompt) => apiClient.post(`/sessions/${sessionId}/generate`, { prompt });

// 👇 NEW API FUNCTION
export const deleteSession = (sessionId) => apiClient.delete(`/sessions/${sessionId}`);

