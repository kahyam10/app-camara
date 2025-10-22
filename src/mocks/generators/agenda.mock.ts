import { faker } from "@faker-js/faker/locale/pt_BR";
import { Evento } from "../../types";
import {
  addDays,
  addWeeks,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

const tiposEvento: Evento["tipo"][] = [
  "Sessão Ordinária",
  "Sessão Extraordinária",
  "Audiência Pública",
  "Reunião",
  "Evento Público",
];

/**
 * Gera eventos para o mês atual
 */
export const generateEventosMesAtual = (): Evento[] => {
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const fimMes = endOfMonth(hoje);

  // Gerar sessões ordinárias (todas as terças, 14:00)
  const eventos: Evento[] = [];
  let id = 1;

  // Sessões ordinárias semanais
  for (let semana = 0; semana < 4; semana++) {
    const data = addWeeks(inicioMes, semana);
    // Ajustar para terça-feira
    const diaSemana = data.getDay();
    const diasParaTerca = (2 - diaSemana + 7) % 7;
    const dataSessao = addDays(data, diasParaTerca);

    if (dataSessao >= inicioMes && dataSessao <= fimMes) {
      eventos.push({
        id: id++,
        titulo: "Sessão Ordinária",
        descricao: "Sessão ordinária semanal da Câmara Municipal",
        tipo: "Sessão Ordinária",
        data: dataSessao,
        horario: "14:00",
        local: "Plenário da Câmara Municipal",
        organizador: "Mesa Diretora",
      });
    }
  }

  // Adicionar alguns eventos extras
  eventos.push(
    {
      id: id++,
      titulo: "Audiência Pública - Orçamento 2026",
      descricao: "Discussão sobre o orçamento municipal para o próximo ano",
      tipo: "Audiência Pública",
      data: addDays(hoje, 10),
      horario: "18:00",
      local: "Auditório da Câmara",
      organizador: "Comissão de Finanças",
    },
    {
      id: id++,
      titulo: "Sessão Extraordinária",
      descricao: "Votação de projetos urgentes",
      tipo: "Sessão Extraordinária",
      data: addDays(hoje, 5),
      horario: "10:00",
      local: "Plenário da Câmara Municipal",
      organizador: "Presidência",
    },
    {
      id: id++,
      titulo: "Reunião das Comissões",
      descricao: "Reunião conjunta das comissões permanentes",
      tipo: "Reunião",
      data: addDays(hoje, 3),
      horario: "09:00",
      local: "Sala de Reuniões",
      organizador: "Comissões Permanentes",
    }
  );

  return eventos.sort((a, b) => a.data.getTime() - b.data.getTime());
};

/**
 * Gera eventos para vários meses
 */
export const generateEventos = (count: number = 30): Evento[] => {
  return Array.from({ length: count }, (_, index) => {
    const diasFuturos = Math.floor(index / 2); // Distribui eventos ao longo do tempo

    return {
      id: index + 1,
      titulo: faker.helpers.arrayElement([
        "Sessão Ordinária",
        "Audiência Pública sobre Mobilidade",
        "Sessão Extraordinária",
        "Reunião de Comissão",
        "Sessão Solene - Homenagens",
        "Debate Público sobre Educação",
        "Audiência sobre Meio Ambiente",
      ]),
      descricao: faker.lorem.sentence(),
      tipo: faker.helpers.arrayElement(tiposEvento),
      data: addDays(new Date(), diasFuturos),
      horario: faker.helpers.arrayElement(["09:00", "10:00", "14:00", "18:00"]),
      local: faker.helpers.arrayElement([
        "Plenário da Câmara Municipal",
        "Auditório da Câmara",
        "Sala de Reuniões",
        "Praça Central",
      ]),
      organizador: faker.helpers.arrayElement([
        "Mesa Diretora",
        "Comissão de Justiça",
        "Comissão de Finanças",
        "Presidência",
      ]),
    };
  }).sort((a, b) => a.data.getTime() - b.data.getTime());
};

/**
 * Filtra eventos por tipo
 */
export const filterEventosByTipo = (
  eventos: Evento[],
  tipo: Evento["tipo"]
): Evento[] => {
  return eventos.filter((evento) => evento.tipo === tipo);
};

/**
 * Retorna eventos de uma data específica
 */
export const getEventosByDate = (eventos: Evento[], date: Date): Evento[] => {
  return eventos.filter(
    (evento) =>
      evento.data.getDate() === date.getDate() &&
      evento.data.getMonth() === date.getMonth() &&
      evento.data.getFullYear() === date.getFullYear()
  );
};
