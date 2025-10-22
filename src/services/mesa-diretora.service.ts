import axios from "axios";

const API_URL = "http://192.168.1.246:3333";

export interface MembroMesaDiretora {
  id: number;
  vereadorId: number;
  cargo: string;
  ordem: number;
  createdAt: string;
  updatedAt: string;
  vereador: {
    id: number;
    nome: string;
    partido: string;
    foto: string | null;
    email: string | null;
    telefone: string | null;
    biografia?: string;
  };
}

/**
 * Serviço para buscar dados da Mesa Diretora da API
 */
export const mesaDiretoraService = {
  /**
   * Busca todos os membros da mesa diretora
   * Transforma URLs das fotos para incluir o baseURL
   */
  async getAll(): Promise<MembroMesaDiretora[]> {
    try {
      const response = await axios.get<{
        success: boolean;
        data: MembroMesaDiretora[];
      }>(`${API_URL}/mesa-diretora`);

      // Transformar URLs das fotos
      const membros = response.data.data.map((membro) => ({
        ...membro,
        vereador: {
          ...membro.vereador,
          foto: membro.vereador.foto
            ? `${API_URL}${membro.vereador.foto}`
            : null,
        },
      }));

      return membros;
    } catch (error) {
      console.error("Erro ao buscar mesa diretora:", error);
      throw error;
    }
  },

  /**
   * Busca membro por ID
   */
  async getById(id: number): Promise<MembroMesaDiretora> {
    try {
      const response = await axios.get<{
        success: boolean;
        data: MembroMesaDiretora;
      }>(`${API_URL}/mesa-diretora/${id}`);

      const membro = response.data.data;

      // Transformar URL da foto
      return {
        ...membro,
        vereador: {
          ...membro.vereador,
          foto: membro.vereador.foto
            ? `${API_URL}${membro.vereador.foto}`
            : null,
        },
      };
    } catch (error) {
      console.error(`Erro ao buscar membro ${id}:`, error);
      throw error;
    }
  },
};
