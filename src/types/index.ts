// Tipos e interfaces do aplicativo Legislativo Ibirapitanga

// Vereadores e Mesa Diretora
export interface Vereador {
  id: number;
  nome: string;
  partido: string;
  foto: string;
  email: string;
  telefone: string;
  biografia?: string;
  redeSocial?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  // Campos adicionais da API
  areaAtuacao?: string[];
  mandato?: string;
  presencaSessoes?: number;
  numeroGabinete?: string;
  andarGabinete?: string;
  ramal?: string;
  horarioAtendimento?: string;
}

export interface MembroMesaDiretora extends Vereador {
  cargo:
    | "Presidente"
    | "Vice-Presidente"
    | "1º Secretário"
    | "2ª Secretária"
    | "1º Tesoureiro"
    | "2ª Tesoureira";
}

// Leis Municipais
export interface Lei {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  categoria:
    | "Educação"
    | "Saúde"
    | "Transporte"
    | "Meio Ambiente"
    | "Cultura"
    | "Outras";
  dataPublicacao: Date;
  autor: string;
  status: "Vigente" | "Revogada" | "Em Revisão";
  textoCompleto?: string;
  arquivo?: string;
}

// Projetos de Lei
export interface Projeto {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  tipo: "Projeto de Lei" | "Projeto de Resolução" | "Projeto de Decreto";
  autor: string;
  dataApresentacao: Date;
  status: "Em Andamento" | "Aprovado" | "Rejeitado" | "Arquivado";
  categoria: string;
  textoCompleto?: string;
  historico?: HistoricoTramitacao[];
}

export interface HistoricoTramitacao {
  data: Date;
  descricao: string;
  local: string;
}

// Sessões Legislativas
export interface Sessao {
  id: number;
  tipo:
    | "Sessão Ordinária"
    | "Sessão Extraordinária"
    | "Sessão Solene"
    | "Audiência Pública";
  data: Date;
  horario: string;
  local: string;
  pauta?: string[];
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
  ata?: string;
  videoUrl?: string;
}

// Votações
export interface Votacao {
  id: number;
  projetoId: number;
  projetoNumero: string;
  projetoTitulo: string;
  data: Date;
  resultado: "Aprovado" | "Rejeitado" | "Em Tramitação";
  votosFavor: number;
  votosContra: number;
  abstencoes: number;
  detalhesVotos?: VotoDetalhe[];
}

export interface VotoDetalhe {
  vereadorId: number;
  vereadorNome: string;
  voto: "Favor" | "Contra" | "Abstenção" | "Ausente";
}

// Notícias
export interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: "Geral" | "Sessões" | "Projetos" | "Eventos" | "Comunicados";
  dataPublicacao: Date;
  autor: string;
  imagemUrl?: string;
  tags?: string[];
}

// Agenda e Eventos
export interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  tipo:
    | "Sessão Ordinária"
    | "Sessão Extraordinária"
    | "Audiência Pública"
    | "Reunião"
    | "Evento Público";
  data: Date;
  horario: string;
  local: string;
  organizador?: string;
}

// Contato
export interface ContatoInfo {
  endereco: string;
  telefone: string;
  email: string;
  horarioFuncionamento: string;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
}

// Feedback
export interface Feedback {
  id: number;
  tipo: "Sugestão" | "Reclamação" | "Elogio" | "Dúvida";
  mensagem: string;
  nome?: string;
  email?: string;
  dataEnvio: Date;
  status: "Pendente" | "Em Análise" | "Respondido";
}

// Tipos de navegação (serão expandidos no arquivo de navegação)
export type RootStackParamList = {
  Home: undefined;
  Vereadores: undefined;
  VereadorDetail: { vereadorId: number };
  MesaDiretora: undefined;
  Agenda: undefined;
  Sessoes: undefined;
  SessaoDetail: { sessaoId: number };
  Votacoes: undefined;
  Projetos: undefined;
  ProjetoDetail: { projetoId: number };
  Leis: undefined;
  LeiDetail: { leiId: number };
  Pesquisa: undefined;
  Noticias: undefined;
  NoticiaDetail: { noticiaId: number };
  Avaliar: undefined;
  Contato: undefined;
  Transmissao: undefined;
};

// Utilitários
export type StatusVotacao = "Aprovado" | "Rejeitado" | "Em Tramitação";
export type StatusProjeto =
  | "Em Andamento"
  | "Aprovado"
  | "Rejeitado"
  | "Arquivado";
export type TipoSessao =
  | "Sessão Ordinária"
  | "Sessão Extraordinária"
  | "Sessão Solene"
  | "Audiência Pública";
