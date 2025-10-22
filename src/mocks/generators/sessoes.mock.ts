import { faker } from "@faker-js/faker/locale/pt_BR";
import { Sessao } from "../../types";
import { addDays, subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tiposSessao: Sessao["tipo"][] = [
  "Sessão Ordinária",
  "Sessão Extraordinária",
  "Sessão Solene",
  "Audiência Pública",
];

const statusSessao: Sessao["status"][] = [
  "Agendada",
  "Em Andamento",
  "Concluída",
  "Cancelada",
];

/**
 * Gera pauta para sessão
 */
const generatePauta = (count: number = 5): string[] => {
  return Array.from({ length: count }, () =>
    faker.helpers.arrayElement([
      "Votação do Projeto de Lei nº 123/2024",
      "Discussão sobre o orçamento municipal",
      "Apresentação de requerimentos",
      "Homenagem aos servidores públicos",
      "Debate sobre mobilidade urbana",
      "Aprovação de ata da sessão anterior",
      "Leitura de expediente",
      "Discussão de projeto de infraestrutura",
    ])
  );
};

/**
 * Gera próximas sessões (futuras)
 */
export const generateProximasSessoes = (count: number = 5): Sessao[] => {
  return Array.from({ length: count }, (_, index) => {
    const data = addDays(new Date(), (index + 1) * 7); // Uma sessão por semana

    return {
      id: index + 1,
      tipo: faker.helpers.arrayElement(tiposSessao),
      data,
      horario: faker.helpers.arrayElement(["09:00", "10:00", "14:00", "18:00"]),
      local: "Plenário da Câmara Municipal",
      pauta: generatePauta(),
      status: "Agendada",
    };
  });
};

/**
 * Gera sessões passadas (históricas)
 */
export const generateSessoesPassadas = (count: number = 10): Sessao[] => {
  return Array.from({ length: count }, (_, index) => {
    const data = subDays(new Date(), (index + 1) * 7);

    return {
      id: 100 + index,
      tipo: faker.helpers.arrayElement(tiposSessao),
      data,
      horario: faker.helpers.arrayElement(["09:00", "10:00", "14:00", "18:00"]),
      local: "Plenário da Câmara Municipal",
      pauta: generatePauta(),
      status: "Concluída",
      ata: faker.lorem.paragraphs(3),
      videoUrl: faker.datatype.boolean()
        ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        : undefined,
    };
  });
};

/**
 * Gera todas as sessões (próximas + passadas)
 */
export const generateTodasSessoes = (): Sessao[] => {
  return [...generateProximasSessoes(5), ...generateSessoesPassadas(10)].sort(
    (a, b) => b.data.getTime() - a.data.getTime()
  );
};
