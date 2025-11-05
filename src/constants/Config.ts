// Constantes de configuração do aplicativo

export const Config = {
  // Informações do aplicativo
  app: {
    name: "Legislativo Maraú",
    version: "1.0.0",
    description: "Aplicativo oficial da Câmara Municipal de Maraú",
  },

  // Informações institucionais
  camara: {
    nome: "CÂMARA MUNICIPAL DE MARAÚ",
    cidade: "Maraú",
    estado: "BA",
    nomeCompleto: "Câmara Municipal de Vereadores de Maraú",
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
    youtube: "https://youtube.com/@camaramarau",
    facebook: "https://facebook.com/camaramarau",
    instagram: "https://instagram.com/camaramarau",
    site: "https://www.camara.marau.ba.gov.br",
  },

  // Configurações de mídia
  media: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedImageFormats: ["jpg", "jpeg", "png", "webp"],
  },
};

export default Config;
