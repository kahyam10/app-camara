import { faker } from "@faker-js/faker/locale/pt_BR";
import { Noticia } from "../../types";
import { subDays, subHours } from "date-fns";

const categorias: Noticia["categoria"][] = [
  "Geral",
  "Sessões",
  "Projetos",
  "Eventos",
  "Comunicados",
];

const titulos = [
  "Câmara aprova projeto de lei sobre uso de espaços públicos",
  "Mesa Diretora define calendário de sessões do próximo semestre",
  "Vereadores discutem melhorias na infraestrutura da cidade",
  "Audiência pública debate mobilidade urbana",
  "Aprovado projeto de incentivo à cultura local",
  "Câmara homenageia servidores públicos municipais",
  "Nova lei sobre proteção ambiental é sancionada",
  "Sessão extraordinária aprova orçamento municipal",
  "Vereadores visitam obras de reforma da praça central",
  "Comissão analisa projeto de lei sobre educação",
];

const tags = [
  "legislação",
  "projetos",
  "votação",
  "cultura",
  "educação",
  "saúde",
  "infraestrutura",
  "meio ambiente",
  "eventos",
  "homenagens",
];

/**
 * Gera uma lista de notícias mockadas
 */
export const generateNoticias = (count: number = 20): Noticia[] => {
  return Array.from({ length: count }, (_, index) => {
    const dataPublicacao =
      index < 5
        ? subHours(new Date(), (index + 1) * 6) // Últimas 5 notícias são recentes (horas)
        : subDays(new Date(), index - 4); // Demais são mais antigas (dias)

    return {
      id: index + 1,
      titulo: faker.helpers.arrayElement(titulos),
      resumo: faker.lorem.paragraph(1),
      conteudo: faker.lorem.paragraphs(5, "\n\n"),
      categoria: faker.helpers.arrayElement(categorias),
      dataPublicacao,
      autor: faker.person.fullName(),
      imagemUrl: faker.datatype.boolean()
        ? faker.image.urlLoremFlickr({ category: "city,building,government" })
        : undefined,
      tags: faker.helpers.arrayElements(tags, { min: 1, max: 3 }),
    };
  }).sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime());
};

/**
 * Filtra notícias por categoria
 */
export const filterNoticiasByCategoria = (
  noticias: Noticia[],
  categoria: Noticia["categoria"]
): Noticia[] => {
  return noticias.filter((noticia) => noticia.categoria === categoria);
};

/**
 * Busca notícias por texto
 */
export const searchNoticias = (
  noticias: Noticia[],
  searchTerm: string
): Noticia[] => {
  const term = searchTerm.toLowerCase();
  return noticias.filter(
    (noticia) =>
      noticia.titulo.toLowerCase().includes(term) ||
      noticia.resumo.toLowerCase().includes(term) ||
      noticia.tags?.some((tag) => tag.toLowerCase().includes(term))
  );
};
