import axios from 'axios';
import { Task, ProcessExcelResponse } from '../types/task';

const api = axios.create({
  baseURL: 'https://spectacular-success-production.up.railway.app/api/v1',
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
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const taskAPI = {
  fetchTareas: async (): Promise<Task[]> => {
    const response = await api.get<{ status: string, data: Task[] }>('/tareas');
    return response.data.data;
  },

  procesarExcel: async (file: File): Promise<ProcessExcelResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ status: string, data: ProcessExcelResponse }>(
      '/procesar-excel',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },
};

export default api;
