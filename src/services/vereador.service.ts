import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { Vereador } from "../types";

// Helper para transformar URL de foto relativa em absoluta
function transformFotoUrl(vereador: Vereador): Vereador {
  if (vereador.foto && !vereador.foto.startsWith("http")) {
    const baseURL = api.defaults.baseURL || "";
    vereador.foto = vereador.foto.startsWith("/")
      ? `${baseURL}${vereador.foto}`
      : `${baseURL}/${vereador.foto}`;
  }
  return vereador;
}

class VereadorService {
  /**
   * Buscar todos os vereadores
   */
  async getAll(): Promise<Vereador[]> {
    try {
      const response = await api.get<PaginatedApiResponse<Vereador>>(
        "/vereadores",
        {
          params: { limit: 100 }, // Buscar todos
        }
      );
      // Transformar URLs das fotos
      return response.data.data.map(transformFotoUrl);
    } catch (error) {
      console.error(
        "[VereadorService] Erro ao buscar vereadores:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar vereador por ID
   */
  async getById(id: number): Promise<Vereador> {
    try {
      const response = await api.get<ApiResponse<Vereador>>(
        `/vereadores/${id}`
      );
      // Transformar URL da foto
      return transformFotoUrl(response.data.data);
    } catch (error) {
      console.error(
        `[VereadorService] Erro ao buscar vereador ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar vereadores com paginação e busca
   */
  async search(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    vereadores: Vereador[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<Vereador>>(
        "/vereadores",
        {
          params: { search, page, limit },
        }
      );

      return {
        vereadores: response.data.data.map(transformFotoUrl),
        total: response.data.total,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error(
        "[VereadorService] Erro ao buscar vereadores:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const vereadorService = new VereadorService();
export default vereadorService;
