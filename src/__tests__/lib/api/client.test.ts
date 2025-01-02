import { AxiosInstance, AxiosResponse } from 'axios';

const mockRequestSuccess = jest.fn((config) => config);
const mockRequestError = jest.fn((error) => Promise.reject(error));
const mockResponseSuccess = jest.fn((response) => response);
const mockResponseError = jest.fn((error) => Promise.reject(error));

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn((success, error) => [success, error]) },
      response: { use: jest.fn((success, error) => [success, error]) }
    },
    defaults: {}
  })),
  AxiosError: jest.fn()
}));

describe('API Client', () => {
  let mockAxiosCreate: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();

    const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    await jest.isolateModules(async () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = 'http://test-api.example.com';

      const mockInstance: Partial<AxiosInstance> = {
        interceptors: {
          request: { use: jest.fn((success, error) => {
            mockRequestSuccess.mockImplementation(success);
            mockRequestError.mockImplementation(error);
            return mockInstance;
          }) },
          response: { use: jest.fn((success, error) => {
            mockResponseSuccess.mockImplementation(success);
            mockResponseError.mockImplementation(error);
            return mockInstance;
          }) }
        },
        defaults: {}
      };

      const axiosModule = await import('axios');
      mockAxiosCreate = jest.spyOn(axiosModule.default, 'create').mockReturnValue(mockInstance as AxiosInstance);

      await import('@/lib/api/client');
    });

    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
  });

  describe('Client Configuration', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'http://test-api.example.com',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
        timeout: 30000,
      });
    });
  });

  describe('Request Interceptor', () => {
    it('should pass through config unchanged', () => {
      const mockConfig = { headers: {} };
      const result = mockRequestSuccess(mockConfig);
      expect(result).toBe(mockConfig);
    });

    it('should handle request errors', async () => {
      const mockError = new Error('Request failed');
      
      try {
        await mockRequestError(mockError);
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Request configuration error');
          expect((error as { cause?: Error }).cause).toBe(mockError);
        }
      }
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses unchanged', () => {
      const mockResponse: AxiosResponse = { data: { success: true } } as AxiosResponse;
      const result = mockResponseSuccess(mockResponse);
      expect(result).toBe(mockResponse);
    });

    it('should handle API error responses', async () => {
      const errorDetails = { field: 'invalid' };
      const mockErrorResponse = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'Bad Request',
              details: errorDetails
            }
          }
        }
      };
      
      try {
        await mockResponseError(mockErrorResponse);
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Bad Request');
          expect((error as { statusCode?: number }).statusCode).toBe(400);
          expect((error as { cause?: unknown }).cause).toEqual(errorDetails);
        }
      }
    });

    it('should handle network errors', async () => {
      const mockNetworkError = {
        message: 'Network Error',
        response: undefined
      };
      
      try {
        await mockResponseError(mockNetworkError);
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Network Error');
          expect((error as { statusCode?: number }).statusCode).toBeUndefined();
        }
      }
    });

    it('should handle unexpected errors', async () => {
      const mockUnexpectedError = {
        response: {
          status: 500,
          data: {}
        }
      };
      
      try {
        await mockResponseError(mockUnexpectedError);
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('An unexpected error occurred');
          expect((error as { statusCode?: number }).statusCode).toBe(500);
        }
      }
    });
  });
});
