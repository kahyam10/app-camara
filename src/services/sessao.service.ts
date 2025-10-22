import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Sessao } from "../types";

class SessaoService {
  /**
   * Buscar todas as sessões
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    sessoes: Sessao[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Sessao>>("/sessoes", {
        params: { page, limit },
      });

      return {
        sessoes: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[SessaoService] Erro ao buscar sessões:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar sessão por ID
   */
  async getById(id: number): Promise<Sessao> {
    try {
      const response = await api.get<ApiResponse<Sessao>>(`/sessoes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[SessaoService] Erro ao buscar sessão ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar sessões por tipo
   */
  async getByTipo(
    tipo: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    sessoes: Sessao[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Sessao>>("/sessoes", {
        params: { tipo, page, limit },
      });

      return {
        sessoes: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[SessaoService] Erro ao buscar sessões por tipo:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar sessões próximas
   */
  async getProximas(limit: number = 10): Promise<Sessao[]> {
    try {
      const hoje = new Date();
      const response = await api.get<PaginatedApiResponse<Sessao>>("/sessoes", {
        params: {
          dataInicio: hoje.toISOString(),
          limit,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "[SessaoService] Erro ao buscar sessões próximas:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const sessaoService = new SessaoService();
export default sessaoService;
