/**
 * Agregador de todos os dados mockados do aplicativo
 *
 * Este arquivo centraliza a geração e acesso a todos os dados mockados.
 * Facilita a migração futura para API real, pois mantém uma interface consistente.
 */

import {
  generateVereadores,
  generateMesaDiretora,
  generateLeis,
  generateProjetos,
  generateProximasSessoes,
  generateSessoesPassadas,
  generateTodasSessoes,
  generateVotacoes,
  generateNoticias,
  generateEventos,
  generateEventosMesAtual,
} from "./generators";

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

/**
 * Classe que gerencia todos os dados mockados
 */
class MockDataManager {
  private static instance: MockDataManager;

  // Cache de dados
  private _vereadores: Vereador[] = [];
  private _mesaDiretora: MembroMesaDiretora[] = [];
  private _leis: Lei[] = [];
  private _projetos: Projeto[] = [];
  private _sessoes: Sessao[] = [];
  private _votacoes: Votacao[] = [];
  private _noticias: Noticia[] = [];
  private _eventos: Evento[] = [];

  private constructor() {
    this.initializeData();
  }

  /**
   * Singleton instance
   */
  public static getInstance(): MockDataManager {
    if (!MockDataManager.instance) {
      MockDataManager.instance = new MockDataManager();
    }
    return MockDataManager.instance;
  }

  /**
   * Inicializa todos os dados mockados
   */
  private initializeData(): void {
    this._vereadores = generateVereadores(10);
    this._mesaDiretora = generateMesaDiretora();
    this._leis = generateLeis(25);
    this._projetos = generateProjetos(20);
    this._sessoes = generateTodasSessoes();
    this._votacoes = generateVotacoes(15);
    this._noticias = generateNoticias(20);
    this._eventos = generateEventosMesAtual();
  }

  /**
   * Regenera todos os dados (útil para testes)
   */
  public regenerateAll(): void {
    this.initializeData();
  }

  /**
   * Reseta os dados para o estado inicial
   */
  public reset(): void {
    this.initializeData();
  }

  // Getters para acessar os dados

  get vereadores(): Vereador[] {
    return this._vereadores;
  }

  get mesaDiretora(): MembroMesaDiretora[] {
    return this._mesaDiretora;
  }

  get leis(): Lei[] {
    return this._leis;
  }

  get projetos(): Projeto[] {
    return this._projetos;
  }

  get projetosEmAndamento(): Projeto[] {
    return this._projetos.filter((p) => p.status === "Em Andamento");
  }

  get projetosAprovados(): Projeto[] {
    return this._projetos.filter((p) => p.status === "Aprovado");
  }

  get sessoes(): Sessao[] {
    return this._sessoes;
  }

  get proximasSessoes(): Sessao[] {
    return this._sessoes.filter((s) => s.data >= new Date());
  }

  get sessoesPassadas(): Sessao[] {
    return this._sessoes.filter((s) => s.data < new Date());
  }

  get votacoes(): Votacao[] {
    return this._votacoes;
  }

  get noticias(): Noticia[] {
    return this._noticias;
  }

  get eventos(): Evento[] {
    return this._eventos;
  }

  // Métodos de busca por ID

  getVereadorById(id: number): Vereador | undefined {
    return this._vereadores.find((v) => v.id === id);
  }

  getLeiById(id: number): Lei | undefined {
    return this._leis.find((l) => l.id === id);
  }

  getProjetoById(id: number): Projeto | undefined {
    return this._projetos.find((p) => p.id === id);
  }

  getSessaoById(id: number): Sessao | undefined {
    return this._sessoes.find((s) => s.id === id);
  }

  getVotacaoById(id: number): Votacao | undefined {
    return this._votacoes.find((v) => v.id === id);
  }

  getNoticiaById(id: number): Noticia | undefined {
    return this._noticias.find((n) => n.id === id);
  }

  getEventoById(id: number): Evento | undefined {
    return this._eventos.find((e) => e.id === id);
  }

  // Métodos de pesquisa

  searchVereadores(query: string): Vereador[] {
    const term = query.toLowerCase();
    return this._vereadores.filter(
      (v) =>
        v.nome.toLowerCase().includes(term) ||
        v.partido.toLowerCase().includes(term)
    );
  }

  searchLeis(query: string): Lei[] {
    const term = query.toLowerCase();
    return this._leis.filter(
      (l) =>
        l.titulo.toLowerCase().includes(term) ||
        l.numero.toLowerCase().includes(term) ||
        l.descricao.toLowerCase().includes(term)
    );
  }

  searchProjetos(query: string): Projeto[] {
    const term = query.toLowerCase();
    return this._projetos.filter(
      (p) =>
        p.titulo.toLowerCase().includes(term) ||
        p.numero.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term)
    );
  }

  searchNoticias(query: string): Noticia[] {
    const term = query.toLowerCase();
    return this._noticias.filter(
      (n) =>
        n.titulo.toLowerCase().includes(term) ||
        n.resumo.toLowerCase().includes(term)
    );
  }
}

// Exporta a instância singleton
export const mockData = MockDataManager.getInstance();

// Exporta também dados de contato (estáticos)
export const contatoInfo: ContatoInfo = {
  endereco: "Praça da Câmara, 123 - Centro, Ibirapitanga - BA",
  telefone: "(73) 3123-4567",
  email: "contato@camaraibirapitanga.ba.gov.br",
  horarioFuncionamento: "Segunda a Sexta, 08:00 às 17:00",
  localizacao: {
    latitude: -14.1667,
    longitude: -39.4167,
  },
};

// Exportações convenientes
export default mockData;
