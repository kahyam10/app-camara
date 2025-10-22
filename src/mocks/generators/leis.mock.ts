import { faker } from "@faker-js/faker/locale/pt_BR";
import { Lei } from "../../types";
import { subDays, subMonths, subYears } from "date-fns";

const categorias: Lei["categoria"][] = [
  "Educação",
  "Saúde",
  "Transporte",
  "Meio Ambiente",
  "Cultura",
  "Outras",
];

const statusLei: Lei["status"][] = ["Vigente", "Revogada", "Em Revisão"];

/**
 * Gera uma lista de leis municipais mockadas
 */
export const generateLeis = (count: number = 20): Lei[] => {
  return Array.from({ length: count }, (_, index) => {
    const ano = faker.date
      .between({
        from: subYears(new Date(), 5),
        to: new Date(),
      })
      .getFullYear();

    return {
      id: index + 1,
      numero: `Lei nº ${faker.number.int({ min: 100, max: 999 })}/${ano}`,
      titulo: faker.helpers.arrayElement([
        "Regulamentação do Uso de Espaços Públicos",
        "Incentivo à Economia Criativa Local",
        "Política Municipal de Proteção Animal",
        "Plano Diretor de Desenvolvimento Urbano",
        "Lei de Incentivo à Cultura",
        "Programa de Reciclagem Municipal",
        "Criação de Áreas de Lazer",
        "Regulamentação do Comércio Local",
        "Política de Mobilidade Urbana",
        "Proteção ao Patrimônio Histórico",
        "Programa de Hortas Comunitárias",
        "Lei de Transparência Municipal",
      ]),
      descricao: faker.lorem.paragraph(),
      categoria: faker.helpers.arrayElement(categorias),
      dataPublicacao: faker.date.between({
        from: subYears(new Date(), 5),
        to: new Date(),
      }),
      autor: faker.person.fullName(),
      status: faker.helpers.arrayElement(statusLei),
      textoCompleto: faker.lorem.paragraphs(5),
    };
  });
};
