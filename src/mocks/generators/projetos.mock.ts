import { faker } from "@faker-js/faker/locale/pt_BR";
import { Projeto, HistoricoTramitacao } from "../../types";
import { subDays, subMonths } from "date-fns";

const tiposProjeto: Projeto["tipo"][] = [
  "Projeto de Lei",
  "Projeto de Resolução",
  "Projeto de Decreto",
];

const statusProjeto: Projeto["status"][] = [
  "Em Andamento",
  "Aprovado",
  "Rejeitado",
  "Arquivado",
];

const categorias = [
  "Educação",
  "Saúde",
  "Transporte",
  "Meio Ambiente",
  "Cultura",
  "Infraestrutura",
  "Assistência Social",
  "Segurança",
];

/**
 * Gera histórico de tramitação
 */
const generateHistorico = (count: number = 3): HistoricoTramitacao[] => {
  return Array.from({ length: count }, (_, index) => ({
    data: subDays(new Date(), (count - index) * 15),
    descricao: faker.helpers.arrayElement([
      "Apresentação do projeto",
      "Encaminhado para Comissão de Justiça",
      "Parecer favorável da comissão",
      "Discussão em plenário",
      "Votação em primeira discussão",
      "Aprovado por unanimidade",
    ]),
    local: faker.helpers.arrayElement([
      "Plenário",
      "Comissão de Justiça",
      "Comissão de Finanças",
      "Mesa Diretora",
    ]),
  }));
};

/**
 * Gera uma lista de projetos de lei mockados
 */
export const generateProjetos = (count: number = 15): Projeto[] => {
  return Array.from({ length: count }, (_, index) => {
    const ano = new Date().getFullYear();
    const status = faker.helpers.arrayElement(statusProjeto);

    return {
      id: index + 1,
      numero: `Projeto de Lei nº ${faker.number.int({
        min: 100,
        max: 999,
      })}/${ano}`,
      titulo: faker.helpers.arrayElement([
        "Altera a Lei Municipal sobre Uso do Solo",
        "Institui o Programa Municipal de Incentivo à Leitura",
        "Cria o Conselho Municipal de Meio Ambiente",
        "Dispõe sobre a criação de áreas de lazer",
        "Regulamenta o uso de espaços públicos",
        "Estabelece diretrizes para Mobilidade Urbana",
        "Cria programa de coleta seletiva",
        "Institui o Dia Municipal da Cultura",
        "Regulamenta horário de funcionamento do comércio",
        "Dispõe sobre proteção aos animais",
      ]),
      descricao: faker.lorem.paragraph(),
      tipo: faker.helpers.arrayElement(tiposProjeto),
      autor: faker.person.fullName(),
      dataApresentacao: faker.date.between({
        from: subMonths(new Date(), 6),
        to: new Date(),
      }),
      status,
      categoria: faker.helpers.arrayElement(categorias),
      textoCompleto: faker.lorem.paragraphs(4),
      historico: status !== "Arquivado" ? generateHistorico() : undefined,
    };
  });
};

/**
 * Filtra projetos por status
 */
export const filterProjetosByStatus = (
  projetos: Projeto[],
  status: Projeto["status"]
): Projeto[] => {
  return projetos.filter((projeto) => projeto.status === status);
};
