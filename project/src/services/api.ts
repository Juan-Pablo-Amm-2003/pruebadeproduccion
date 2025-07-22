import axios from 'axios';
import { Task, ProcessExcelResponse } from '../types/task';

const api = axios.create({
  baseURL: 'https://pruebadeproduccion.onrender.com',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    } else if (error.request) {
      console.error('API Error Request:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const taskAPI = {
  fetchTareas: async (): Promise<Task[]> => {
    const response = await api.get<{ status: string; data: Task[] }>('/api/v1/tareas');
    console.log(response.data.data);
    return response.data.data;
  },

  procesarExcel: async (file: File): Promise<ProcessExcelResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ status: string; data: ProcessExcelResponse }>(
      '/api/v1/procesar-excel',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },
};

export default api;
