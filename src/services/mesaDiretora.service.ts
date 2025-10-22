import {
  api,
  ApiResponse,
  PaginatedApiResponse,
  handleApiError,
} from "./api.config";
import type { MembroMesaDiretora } from "../types";

class MesaDiretoraService {
  /**
   * Buscar todos os membros da mesa diretora
   */
  async getAll(): Promise<MembroMesaDiretora[]> {
    try {
      const response = await api.get<PaginatedApiResponse<MembroMesaDiretora>>(
        "/mesa-diretora",
        {
          params: { limit: 100 },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "[MesaDiretoraService] Erro ao buscar mesa diretora:",
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Buscar membro por ID
   */
  async getById(id: number): Promise<MembroMesaDiretora> {
    try {
      const response = await api.get<ApiResponse<MembroMesaDiretora>>(
        `/mesa-diretora/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `[MesaDiretoraService] Erro ao buscar membro ${id}:`,
        handleApiError(error)
      );
      throw new Error(handleApiError(error));
    }
  }
}

export const mesaDiretoraService = new MesaDiretoraService();
export default mesaDiretoraService;
