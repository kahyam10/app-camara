import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Projeto } from "../types";

class ProjetoService {
  /**
   * Buscar todos os projetos
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    projetos: Projeto[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Projeto>>(
        "/projetos",
        {
          params: { page, limit },
        }
      );

      return {
        projetos: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[ProjetoService] Erro ao buscar projetos:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar projeto por ID
   */
  async getById(id: number): Promise<Projeto> {
    try {
      const response = await api.get<ApiResponse<Projeto>>(`/projetos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[ProjetoService] Erro ao buscar projeto ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar projetos por status
   */
  async getByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    projetos: Projeto[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Projeto>>(
        "/projetos",
        {
          params: { status, page, limit },
        }
      );

      return {
        projetos: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[ProjetoService] Erro ao buscar projetos por status:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar projetos por termo
   */
  async search(
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    projetos: Projeto[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Projeto>>(
        "/projetos",
        {
          params: { search, page, limit },
        }
      );

      return {
        projetos: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[ProjetoService] Erro ao buscar projetos:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const projetoService = new ProjetoService();
export default projetoService;
