import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Votacao } from "../types";

class VotacaoService {
  /**
   * Buscar todas as votações
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    votacoes: Votacao[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Votacao>>(
        "/votacoes",
        {
          params: { page, limit },
        }
      );

      return {
        votacoes: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[VotacaoService] Erro ao buscar votações:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar votação por ID
   */
  async getById(id: number): Promise<Votacao> {
    try {
      const response = await api.get<ApiResponse<Votacao>>(`/votacoes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[VotacaoService] Erro ao buscar votação ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar votações de um projeto
   */
  async getByProjetoId(projetoId: number): Promise<Votacao[]> {
    try {
      const response = await api.get<PaginatedApiResponse<Votacao>>(
        "/votacoes",
        {
          params: { projetoId, limit: 100 },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `[VotacaoService] Erro ao buscar votações do projeto ${projetoId}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar votações recentes
   */
  async getRecentes(limit: number = 10): Promise<Votacao[]> {
    try {
      const response = await api.get<PaginatedApiResponse<Votacao>>(
        "/votacoes",
        {
          params: { page: 1, limit },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "[VotacaoService] Erro ao buscar votações recentes:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const votacaoService = new VotacaoService();
export default votacaoService;
