import axios, { AxiosError } from 'axios';
import { ApiError, ApiResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(new ApiError('Request configuration error', undefined, error));
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const statusCode = error.response?.status;
    const errorResponse = error.response?.data;

    if (errorResponse?.error) {
      return Promise.reject(
        new ApiError(
          errorResponse.error.message,
          statusCode,
          errorResponse.error.details
        )
      );
    }

    return Promise.reject(
      new ApiError(
        error.message || 'An unexpected error occurred',
        statusCode,
        error
      )
    );
  }
);