/**
 * Camada de serviço para API - MIGRADO PARA API REAL
 * Conecta com o backend e usa dados mockados como fallback
 */

import {
  vereadorService,
  mesaDiretoraService,
  noticiaService,
  eventoService,
  leiService,
  projetoService,
  sessaoService,
  votacaoService,
} from "./index";

import mockData, { contatoInfo } from "../mocks/data";
import type {
  Vereador,
  MembroMesaDiretora,
  Lei,
  Projeto,
  Sessao,
  Votacao,
  Noticia,
  Evento,
  ContatoInfo,
} from "../types";

class ApiService {
  async getVereadores(): Promise<Vereador[]> {
    try {
      console.log("🔄 [ApiService] Buscando vereadores da API...");
      const result = await vereadorService.getAll();
      console.log(
        `✅ [ApiService] ${result.length} vereadores carregados da API`
      );
      return result;
    } catch (error) {
      console.warn(
        "⚠️ [ApiService] Erro ao buscar vereadores da API, usando mock:",
        error
      );
      console.log(
        `📦 [ApiService] Retornando ${mockData.vereadores.length} vereadores mockados`
      );
      return mockData.vereadores;
    }
  }

  async getVereadorById(id: number): Promise<Vereador | undefined> {
    try {
      return await vereadorService.getById(id);
    } catch (error) {
      return mockData.getVereadorById(id);
    }
  }

  async searchVereadores(query: string): Promise<Vereador[]> {
    try {
      const result = await vereadorService.search(query);
      return result.vereadores;
    } catch (error) {
      return mockData.searchVereadores(query);
    }
  }

  async getMesaDiretora(): Promise<MembroMesaDiretora[]> {
    try {
      return await mesaDiretoraService.getAll();
    } catch (error) {
      return mockData.mesaDiretora;
    }
  }

  async getLeis(): Promise<Lei[]> {
    try {
      const result = await leiService.getAll(1, 100);
      return result.leis;
    } catch (error) {
      return mockData.leis;
    }
  }

  async getLeiById(id: number): Promise<Lei | undefined> {
    try {
      return await leiService.getById(id);
    } catch (error) {
      return mockData.getLeiById(id);
    }
  }

  async searchLeis(query: string): Promise<Lei[]> {
    try {
      const result = await leiService.search(query);
      return result.leis;
    } catch (error) {
      return mockData.searchLeis(query);
    }
  }

  async getProjetos(): Promise<Projeto[]> {
    try {
      const result = await projetoService.getAll(1, 100);
      return result.projetos;
    } catch (error) {
      return mockData.projetos;
    }
  }

  async getProjetosEmAndamento(): Promise<Projeto[]> {
    try {
      const result = await projetoService.getByStatus("Em Andamento");
      return result.projetos;
    } catch (error) {
      return mockData.projetosEmAndamento;
    }
  }

  async getProjetosAprovados(): Promise<Projeto[]> {
    try {
      const result = await projetoService.getByStatus("Aprovado");
      return result.projetos;
    } catch (error) {
      return mockData.projetosAprovados;
    }
  }

  async getProjetoById(id: number): Promise<Projeto | undefined> {
    try {
      return await projetoService.getById(id);
    } catch (error) {
      return mockData.getProjetoById(id);
    }
  }

  async searchProjetos(query: string): Promise<Projeto[]> {
    try {
      const result = await projetoService.search(query);
      return result.projetos;
    } catch (error) {
      return mockData.searchProjetos(query);
    }
  }

  async getSessoes(): Promise<Sessao[]> {
    try {
      const result = await sessaoService.getAll(1, 100);
      return result.sessoes;
    } catch (error) {
      return mockData.sessoes;
    }
  }

  async getProximasSessoes(): Promise<Sessao[]> {
    try {
      return await sessaoService.getProximas(10);
    } catch (error) {
      return mockData.proximasSessoes;
    }
  }

  async getSessoesPassadas(): Promise<Sessao[]> {
    try {
      const result = await sessaoService.getAll(1, 100);
      const hoje = new Date();
      return result.sessoes.filter((s) => new Date(s.data) < hoje);
    } catch (error) {
      return mockData.sessoesPassadas;
    }
  }

  async getSessaoById(id: number): Promise<Sessao | undefined> {
    try {
      return await sessaoService.getById(id);
    } catch (error) {
      return mockData.getSessaoById(id);
    }
  }

  async getVotacoes(): Promise<Votacao[]> {
    try {
      const result = await votacaoService.getAll(1, 100);
      return result.votacoes;
    } catch (error) {
      return mockData.votacoes;
    }
  }

  async getVotacaoById(id: number): Promise<Votacao | undefined> {
    try {
      return await votacaoService.getById(id);
    } catch (error) {
      return mockData.getVotacaoById(id);
    }
  }

  async getNoticias(): Promise<Noticia[]> {
    try {
      const result = await noticiaService.getAll(1, 100);
      return result.noticias;
    } catch (error) {
      return mockData.noticias;
    }
  }

  async getNoticiaById(id: number): Promise<Noticia | undefined> {
    try {
      return await noticiaService.getById(id);
    } catch (error) {
      return mockData.getNoticiaById(id);
    }
  }

  async searchNoticias(query: string): Promise<Noticia[]> {
    try {
      const result = await noticiaService.getAll(1, 100);
      return result.noticias.filter(
        (n) =>
          n.titulo.toLowerCase().includes(query.toLowerCase()) ||
          n.resumo?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      return mockData.searchNoticias(query);
    }
  }

  async getEventos(): Promise<Evento[]> {
    try {
      const result = await eventoService.getAll(1, 100);
      return result.eventos;
    } catch (error) {
      return mockData.eventos;
    }
  }

  async getEventoById(id: number): Promise<Evento | undefined> {
    try {
      return await eventoService.getById(id);
    } catch (error) {
      return mockData.getEventoById(id);
    }
  }

  async getContatoInfo(): Promise<ContatoInfo> {
    return contatoInfo;
  }

  async searchAll(query: string): Promise<{
    vereadores: Vereador[];
    leis: Lei[];
    projetos: Projeto[];
    noticias: Noticia[];
  }> {
    try {
      const [vereadores, leis, projetos, noticias] = await Promise.all([
        this.searchVereadores(query),
        this.searchLeis(query),
        this.searchProjetos(query),
        this.searchNoticias(query),
      ]);
      return { vereadores, leis, projetos, noticias };
    } catch (error) {
      return {
        vereadores: mockData.searchVereadores(query),
        leis: mockData.searchLeis(query),
        projetos: mockData.searchProjetos(query),
        noticias: mockData.searchNoticias(query),
      };
    }
  }
}

const apiService = new ApiService();
export default apiService;

export {
  vereadorService,
  mesaDiretoraService,
  noticiaService,
  eventoService,
  leiService,
  projetoService,
  sessaoService,
  votacaoService,
};
