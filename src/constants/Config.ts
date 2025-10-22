// Constantes de configuração do aplicativo

export const Config = {
  // Informações do aplicativo
  app: {
    name: "Legislativo Ibirapitanga",
    version: "1.0.0",
    description: "Aplicativo oficial da Câmara Municipal de Ibirapitanga",
  },

  // Informações institucionais
  camara: {
    nome: "CÂMARA MUNICIPAL DE IBIRAPITANGA",
    cidade: "Ibirapitanga",
    estado: "BA",
    nomeCompleto: "Câmara Municipal de Vereadores de Ibirapitanga",
  },

  // Configurações de paginação
  pagination: {
    itemsPerPage: 10,
    maxItemsPerPage: 50,
  },

  // Configurações de busca
  search: {
    minChars: 3,
    debounceMs: 300,
  },

  // Links externos
  links: {
    appStore: "https://apps.apple.com/",
    playStore: "https://play.google.com/",
    youtube: "https://youtube.com/@camaraibirapitanga",
    facebook: "https://facebook.com/camaraibirapitanga",
    instagram: "https://instagram.com/camaraibirapitanga",
    site: "https://www.camaraibirapitanga.ba.gov.br",
  },

  // Configurações de mídia
  media: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedImageFormats: ["jpg", "jpeg", "png", "webp"],
  },
};

export default Config;
