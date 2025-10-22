import api from "./api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos
export interface AlternativaPesquisa {
  id: number;
  texto: string;
  votos: number;
}

export interface PesquisaPublica {
  id: number;
  titulo: string;
  descricao?: string;
  dataLimite: string;
  status: "Ativa" | "Encerrada" | "Rascunho";
  documentoUrl?: string;
  alternativas: AlternativaPesquisa[];
  totalVotos: number;
  createdAt: string;
  updatedAt: string;
}

export interface VotarData {
  alternativaId: number;
  dispositivo?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Gera um ID único para o dispositivo
 * Usado para prevenir votos duplicados
 * Armazena no AsyncStorage para persistir entre sessões
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    // Tenta recuperar o ID já gerado
    let deviceId = await AsyncStorage.getItem("@device_id");

    if (deviceId) {
      return deviceId;
    }

    // Gera novo ID único
    deviceId = `device-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Salva para uso futuro
    await AsyncStorage.setItem("@device_id", deviceId);

    return deviceId;
  } catch (error) {
    console.error("Erro ao gerar device ID:", error);
    // Fallback: ID baseado apenas em timestamp
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

export const pesquisaPublicaService = {
  /**
   * Lista pesquisas públicas ativas
   */
  async getPublicas(): Promise<ApiResponse<PesquisaPublica[]>> {
    const response = await api.get<ApiResponse<PesquisaPublica[]>>(
      "/pesquisas/publicas",
      {
        params: { ativas: true },
      }
    );
    return response.data;
  },

  /**
   * Busca uma pesquisa específica por ID (rota pública)
   */
  async getByIdPublico(id: number): Promise<ApiResponse<PesquisaPublica>> {
    const response = await api.get<ApiResponse<PesquisaPublica>>(
      `/pesquisas/publicas/${id}`
    );
    return response.data;
  },

  /**
   * Registra um voto em uma pesquisa
   * @param pesquisaId - ID da pesquisa
   * @param alternativaId - ID da alternativa escolhida
   * @param dispositivo - ID único do dispositivo (opcional)
   */
  async votar(
    pesquisaId: number,
    alternativaId: number,
    dispositivo?: string
  ): Promise<ApiResponse<{ mensagem: string }>> {
    const response = await api.post<ApiResponse<{ mensagem: string }>>(
      `/pesquisas/publicas/${pesquisaId}/votar`,
      {
        alternativaId,
        dispositivo: dispositivo || (await getDeviceId()),
      }
    );
    return response.data;
  },

  /**
   * Verifica se o dispositivo já votou em uma pesquisa
   * @param pesquisaId - ID da pesquisa
   * @param dispositivo - ID único do dispositivo
   */
  async verificarVoto(
    pesquisaId: number,
    dispositivo?: string
  ): Promise<boolean> {
    try {
      const deviceId = dispositivo || (await getDeviceId());
      const response = await api.get<ApiResponse<{ jaVotou: boolean }>>(
        `/pesquisas/publicas/${pesquisaId}/verificar-voto`,
        {
          params: { dispositivo: deviceId },
        }
      );
      return response.data.data.jaVotou;
    } catch (error) {
      console.error("Erro ao verificar voto:", error);
      return false;
    }
  },
};
