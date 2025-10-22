import { faker } from "@faker-js/faker/locale/pt_BR";
import { Vereador, MembroMesaDiretora } from "../../types";

// Configurar seed para dados consistentes (opcional)
// faker.seed(123);

const partidos = [
  "PT",
  "PSDB",
  "MDB",
  "PP",
  "PDT",
  "PSB",
  "PL",
  "REPUBLICANOS",
  "UNIÃO",
  "PSD",
];

// URLs de fotos reais de pessoas para vereadores
const fotosVereadores = [
  // Homens
  { url: "https://randomuser.me/api/portraits/men/1.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/2.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/3.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/4.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/5.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/6.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/7.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/8.jpg", genero: "masculino" },
  { url: "https://randomuser.me/api/portraits/men/9.jpg", genero: "masculino" },
  {
    url: "https://randomuser.me/api/portraits/men/10.jpg",
    genero: "masculino",
  },
  // Mulheres
  {
    url: "https://randomuser.me/api/portraits/women/1.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/2.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/3.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/4.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/5.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/6.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/7.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/8.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/9.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/10.jpg",
    genero: "feminino",
  },
];

// URLs de fotos para mesa diretora (pessoas mais velhas/formais)
const fotosMesaDiretora = [
  {
    url: "https://randomuser.me/api/portraits/men/32.jpg",
    genero: "masculino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/32.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/men/33.jpg",
    genero: "masculino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/33.jpg",
    genero: "feminino",
  },
  {
    url: "https://randomuser.me/api/portraits/men/34.jpg",
    genero: "masculino",
  },
  {
    url: "https://randomuser.me/api/portraits/women/34.jpg",
    genero: "feminino",
  },
];

/**
 * Gera uma lista de vereadores mockados
 */
export const generateVereadores = (count: number = 10): Vereador[] => {
  return Array.from({ length: count }, (_, index) => {
    const fotoData = fotosVereadores[index % fotosVereadores.length];
    const genero = fotoData.genero === "masculino" ? "male" : "female";

    return {
      id: index + 1,
      nome: faker.person.fullName({ sex: genero }),
      partido: faker.helpers.arrayElement(partidos),
      foto: fotoData.url,
      email: faker.internet.email().toLowerCase(),
      telefone: faker.phone.number(),
      biografia: faker.lorem.paragraph(),
      redeSocial: {
        facebook: faker.datatype.boolean()
          ? `@${faker.internet.username()}`
          : undefined,
        instagram: faker.datatype.boolean()
          ? `@${faker.internet.username()}`
          : undefined,
        twitter: faker.datatype.boolean()
          ? `@${faker.internet.username()}`
          : undefined,
      },
    };
  });
};

/**
 * Gera a mesa diretora mockada
 */
export const generateMesaDiretora = (): MembroMesaDiretora[] => {
  const cargos: MembroMesaDiretora["cargo"][] = [
    "Presidente",
    "Vice-Presidente",
    "1º Secretário",
    "2ª Secretária",
    "1º Tesoureiro",
    "2ª Tesoureira",
  ];

  return cargos.map((cargo, index) => {
    const fotoData = fotosMesaDiretora[index % fotosMesaDiretora.length];
    const genero = fotoData.genero === "masculino" ? "male" : "female";

    return {
      id: 100 + index,
      nome: faker.person.fullName({ sex: genero }),
      partido: faker.helpers.arrayElement(partidos),
      foto: fotoData.url,
      email: faker.internet.email().toLowerCase(),
      telefone: faker.phone.number(),
      cargo,
      biografia: faker.lorem.paragraph(),
      redeSocial: {
        facebook: `@${faker.internet.username()}`,
        instagram: `@${faker.internet.username()}`,
      },
    };
  });
};
