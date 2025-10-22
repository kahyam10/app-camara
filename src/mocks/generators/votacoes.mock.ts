import { faker } from "@faker-js/faker/locale/pt_BR";
import { Votacao, VotoDetalhe } from "../../types";
import { subDays, subMonths } from "date-fns";

const resultados: Votacao["resultado"][] = [
  "Aprovado",
  "Rejeitado",
  "Em Tramitação",
];

/**
 * Gera detalhes de votos individuais
 */
const generateVotosDetalhados = (
  totalVereadores: number = 10
): VotoDetalhe[] => {
  return Array.from({ length: totalVereadores }, (_, index) => ({
    vereadorId: index + 1,
    vereadorNome: faker.person.fullName(),
    voto: faker.helpers.arrayElement([
      "Favor",
      "Contra",
      "Abstenção",
      "Ausente",
    ] as const),
  }));
};

/**
 * Calcula totais de votos
 */
const calcularTotaisVotos = (detalhes: VotoDetalhe[]) => {
  return {
    votosFavor: detalhes.filter((v) => v.voto === "Favor").length,
    votosContra: detalhes.filter((v) => v.voto === "Contra").length,
    abstencoes: detalhes.filter((v) => v.voto === "Abstenção").length,
  };
};

/**
 * Gera uma lista de votações mockadas
 */
export const generateVotacoes = (count: number = 15): Votacao[] => {
  return Array.from({ length: count }, (_, index) => {
    const ano = new Date().getFullYear();
    const resultado = faker.helpers.arrayElement(resultados);
    const detalhesVotos =
      resultado !== "Em Tramitação" ? generateVotosDetalhados() : undefined;

    const totais = detalhesVotos
      ? calcularTotaisVotos(detalhesVotos)
      : { votosFavor: 0, votosContra: 0, abstencoes: 0 };

    return {
      id: index + 1,
      projetoId: faker.number.int({ min: 1, max: 50 }),
      projetoNumero: `Projeto de Lei nº ${faker.number.int({
        min: 100,
        max: 999,
      })}/${ano}`,
      projetoTitulo: faker.helpers.arrayElement([
        "Altera a Lei Municipal nº 456/2022",
        "Institui o Programa Municipal de Incentivo",
        "Cria o Conselho Municipal de Meio Ambiente",
        "Dispõe sobre a criação de áreas de lazer",
        "Regulamenta o uso de espaços públicos",
        "Estabelece políticas de proteção ambiental",
        "Cria programa de assistência social",
        "Regulamenta transporte público municipal",
      ]),
      data: faker.date.between({
        from: subMonths(new Date(), 3),
        to: new Date(),
      }),
      resultado,
      votosFavor: totais.votosFavor,
      votosContra: totais.votosContra,
      abstencoes: totais.abstencoes,
      detalhesVotos,
    };
  });
};

/**
 * Filtra votações por resultado
 */
export const filterVotacoesByResultado = (
  votacoes: Votacao[],
  resultado: Votacao["resultado"]
): Votacao[] => {
  return votacoes.filter((votacao) => votacao.resultado === resultado);
};
