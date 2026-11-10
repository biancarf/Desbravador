/**
 * Massa de testes centralizada. Valores sensíveis/variáveis podem ser
 * sobrescritos por variáveis de ambiente (ver .env.example).
 */
export const HOTEL = {
  /**
   * O enunciado aponta para https://reservas.desbravador.com.br/1111, que hoje
   * retorna 404. O motor migrou para /hotel-app/<slug>. O slug "desbravador-4-5"
   * é o hotel de demonstração (o próprio front-end roteia esse slug para a API
   * de homologação). Sobrescreva com HOTEL_SLUG se o avaliador indicar outro.
   */
  slug: process.env.HOTEL_SLUG ?? 'desbravador-4-5',
};

export type CartaoTipo = 'enunciado' | 'aprovado';

/**
 * Cartões de TESTE de gateway — nunca use cartão real aqui.
 * - "enunciado": exatamente o cartão do PDF do desafio (validade 12/23 → vencido).
 * - "aprovado": mesmo número com validade futura, para validar o caminho feliz.
 */
export const CARTOES: Record<CartaoTipo, { numero: string; nome: string; validade: string; cvc: string }> = {
  enunciado: {
    numero: '4000 0000 0000 0044',
    nome: 'DESBRAVADOR SOFTWARE',
    validade: '12/23',
    cvc: '123',
  },
  aprovado: {
    numero: process.env.CARD_NUMBER ?? '4000 0000 0000 0044',
    nome: process.env.CARD_NAME ?? 'DESBRAVADOR SOFTWARE',
    validade: process.env.CARD_EXPIRY ?? '12/30',
    cvc: process.env.CARD_CVC ?? '123',
  },
};

export const HOSPEDES = [
  { nome: 'Ana', sobrenome: 'Teste QA', email: 'ana.qa@example.com', telefone: '(49) 99999-0001', documento: '11144477735' },
  { nome: 'Bruno', sobrenome: 'Teste QA', email: 'bruno.qa@example.com', telefone: '(49) 99999-0002', documento: '52998224725' },
  { nome: 'Caio', sobrenome: 'Teste QA (criança 5 anos)', email: '', telefone: '', documento: '' },
];
