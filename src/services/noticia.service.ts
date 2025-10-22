import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Noticia } from "../types";

class NoticiaService {
  /**
   * Buscar todas as notícias
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    noticias: Noticia[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Noticia>>(
        "/noticias",
        {
          params: { page, limit, publicada: true }, // Apenas notícias publicadas
        }
      );

      return {
        noticias: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[NoticiaService] Erro ao buscar notícias:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar notícia por ID
   */
  async getById(id: number): Promise<Noticia> {
    try {
      const response = await api.get<ApiResponse<Noticia>>(`/noticias/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `[NoticiaService] Erro ao buscar notícia ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar notícias por categoria
   */
  async getByCategoria(
    categoria: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    noticias: Noticia[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Noticia>>(
        "/noticias",
        {
          params: { categoria, page, limit, publicada: true },
        }
      );

      return {
        noticias: response.data.data,
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[NoticiaService] Erro ao buscar notícias por categoria:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar notícias recentes (últimas N notícias)
   */
  async getRecentes(limit: number = 5): Promise<Noticia[]> {
    try {
      const response = await api.get<PaginatedApiResponse<Noticia>>(
        "/noticias",
        {
          params: { page: 1, limit, publicada: true },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "[NoticiaService] Erro ao buscar notícias recentes:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const noticiaService = new NoticiaService();
export default noticiaService;
