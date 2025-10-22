/**
 * TIPOS DE NAVEGAÇÃO
 * Define os parâmetros de cada tela do aplicativo
 */

import { Vereador, Lei, Projeto, Sessao, Votacao, Noticia } from "../types";
import { PesquisaPublica } from "../services/pesquisaPublica.service";

// Parâmetros de todas as telas do Stack Navigator
export type RootStackParamList = {
  // Tela inicial
  Home: undefined;

  // Vereadores e Mesa Diretora
  Vereadores: undefined;
  VereadorDetalhes: { vereadorId: string };
  MesaDiretora: undefined;

  // Agenda e Sessões
  Agenda: undefined;
  Sessoes: undefined;
  SessaoDetalhes: { sessaoId: string };

  // Votações
  Votacoes: undefined;
  VotacaoDetalhes: { votacaoId: string };

  // Projetos e Leis
  Projetos: undefined;
  ProjetoDetalhes: { projetoId: string };
  Leis: undefined;
  LeiDetalhes: { leiId: string };

  // Notícias
  Noticias: undefined;
  NoticiaDetalhes: { noticiaId: string };

  // Pesquisas Públicas
  Pesquisas: undefined;
  VotarPesquisa: { pesquisa: PesquisaPublica };

  // Interação
  Avaliar: undefined;
  Contato: undefined;

  // Transmissão ao vivo
  Transmissao: undefined;
};

// Type helpers para navegação tipada
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  route: { params: RootStackParamList[T] };
  navigation: any;
};
