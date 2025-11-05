import axios from "axios";

/**
 * Configuração da API
 *
 * IMPORTANTE: Para desenvolvimento local:
 * - Android Emulator: use 10.0.2.2:3333
 * - iOS Simulator: use localhost:3333
 * - Dispositivo físico: use o IP da sua máquina (ex: 192.168.1.100:3333)
 *
 * Para descobrir seu IP:
 * Windows: ipconfig
 * Mac/Linux: ifconfig
 */

// URL base da API - altere conforme necessário
const getBaseURL = () => {
  // Verificar se está em modo de desenvolvimento
  const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;
  
  if (isDevelopment) {
    // Para Android Emulator
    return "http://192.168.1.246:3333";

    // Para iOS Simulator ou dispositivo físico, descomente e use seu IP:
    // return 'http://192.168.1.100:3333';

    // Para Expo Go, use o IP da sua máquina
    // return 'http://SEU_IP_AQUI:3333';
  }

  // Em produção (web build)
  return "https://api.camara.marau.kssoft.com.br";
};

// Instância do axios configurada
export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs (apenas em desenvolvimento)
if (__DEV__) {
  api.interceptors.request.use(
    (config) => {
      console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error("❌ [API] Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`✅ [API] ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error("❌ [API] Response Error:", error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      return Promise.reject(error);
    }
  );
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper para lidar com erros da API
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Erro de resposta do servidor
    return error.response.data?.message || "Erro ao comunicar com o servidor";
  } else if (error.request) {
    // Requisição foi feita mas não houve resposta
    return "Sem resposta do servidor. Verifique sua conexão.";
  } else {
    // Erro na configuração da requisição
    return error.message || "Erro desconhecido";
  }
};

export default api;
