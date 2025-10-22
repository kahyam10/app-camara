import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Lei } from "../types";

class LeiService {
  /**
   * Buscar todas as leis
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    leis: Lei[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Lei>>("/leis", {
        params: { page, limit },
      });

      return {
        leis: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("[LeiService] Erro ao buscar leis:", handleApiError(error));
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar lei por ID
   */
  async getById(id: number): Promise<Lei> {
    try {
      const response = await api.get<ApiResponse<Lei>>(`/leis/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[LeiService] Erro ao buscar lei ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar leis por categoria
   */
  async getByCategoria(
    categoria: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    leis: Lei[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Lei>>("/leis", {
        params: { categoria, page, limit },
      });

      return {
        leis: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[LeiService] Erro ao buscar leis por categoria:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar leis por termo
   */
  async search(
    search: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    leis: Lei[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Lei>>("/leis", {
        params: { search, page, limit },
      });

      return {
        leis: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("[LeiService] Erro ao buscar leis:", handleApiError(error));
      throw new Error(handleApiError(error));
    }
  }
}

export const leiService = new LeiService();
export default leiService;
