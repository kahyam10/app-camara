/**
 * Serviços de API
 *
 * Todos os serviços para comunicação com o backend
 */

export { api, handleApiError } from "./api.config";
export type { ApiResponse, PaginatedApiResponse } from "./api.config";

export { vereadorService } from "./vereador.service";
export { mesaDiretoraService } from "./mesaDiretora.service";
export { noticiaService } from "./noticia.service";
export { eventoService } from "./evento.service";
export { leiService } from "./lei.service";
export { projetoService } from "./projeto.service";
export { sessaoService } from "./sessao.service";
export { votacaoService } from "./votacao.service";

// Exportação default para compatibilidade com código antigo
import { vereadorService } from "./vereador.service";
import { mesaDiretoraService } from "./mesaDiretora.service";
import { noticiaService } from "./noticia.service";
import { eventoService } from "./evento.service";
import { leiService } from "./lei.service";
import { projetoService } from "./projeto.service";
import { sessaoService } from "./sessao.service";
import { votacaoService } from "./votacao.service";

export default {
  vereadores: vereadorService,
  mesaDiretora: mesaDiretoraService,
  noticias: noticiaService,
  eventos: eventoService,
  leis: leiService,
  projetos: projetoService,
  sessoes: sessaoService,
  votacoes: votacaoService,
};
