import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Evento } from "../types";

class EventoService {
  /**
   * Buscar todos os eventos
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    eventos: Evento[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Evento>>("/eventos", {
        params: { page, limit },
      });

      return {
        eventos: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[EventoService] Erro ao buscar eventos:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar evento por ID
   */
  async getById(id: number): Promise<Evento> {
    try {
      const response = await api.get<ApiResponse<Evento>>(`/eventos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[EventoService] Erro ao buscar evento ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar eventos por período
   */
  async getByPeriodo(dataInicio: Date, dataFim: Date): Promise<Evento[]> {
    try {
      const response = await api.get<PaginatedApiResponse<Evento>>("/eventos", {
        params: {
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
          limit: 100,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "[EventoService] Erro ao buscar eventos por período:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar eventos próximos
   */
  async getProximos(limit: number = 10): Promise<Evento[]> {
    try {
      const hoje = new Date();
      const response = await api.get<PaginatedApiResponse<Evento>>("/eventos", {
        params: {
          dataInicio: hoje.toISOString(),
          limit,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "[EventoService] Erro ao buscar eventos próximos:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const eventoService = new EventoService();
export default eventoService;
