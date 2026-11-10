import { expect, type Locator, type Page } from '@playwright/test';
import { CARTOES, HOSPEDES, type CartaoTipo } from '../data/test-data';

/**
 * Etapas "hóspedes" (/step3) e "pagamento" (/checkout).
 *
 * IMPORTANTE: estas etapas estavam INALCANÇÁVEIS na execução de 10/11/2026
 * (BUG-01 impede adicionar qualquer quarto ao carrinho). Por isso os
 * seletores abaixo são semânticos (label/role/placeholder), não mapeados no
 * DOM real. Ao destravar o fluxo, a primeira tarefa é validá-los com
 * `npx playwright codegen` e ajustar aqui — os steps não mudam.
 */
export class CheckoutPage {
  readonly avancar: Locator;
  readonly pagar: Locator;
  readonly confirmacao: Locator;
  readonly erroPagamento: Locator;

  constructor(private readonly page: Page) {
    this.avancar = page.getByRole('button', { name: /continuar|avançar|próximo|reservar/i });
    this.pagar = page.getByRole('button', { name: /pagar|finalizar|confirmar/i });
    this.confirmacao = page.getByText(/reserva (confirmada|efetuada|realizada)|código da reserva|localizador/i);
    this.erroPagamento = page.getByText(/recusad|vencid|inválid|não autorizad/i);
  }

  private campo(nome: RegExp, indice = 0): Locator {
    return this.page.getByLabel(nome).or(this.page.getByPlaceholder(nome)).nth(indice);
  }

  async avancarParaHospedes() {
    await this.avancar.first().click();
    await expect(this.page).toHaveURL(/step3|checkout/);
  }

  async preencherHospedes() {
    for (const [i, h] of HOSPEDES.entries()) {
      await this.campo(/^nome/i, i).fill(h.nome);
      const sobrenome = this.campo(/sobrenome/i, i);
      if (await sobrenome.count()) await sobrenome.fill(h.sobrenome);
      if (h.email) await this.campo(/e-?mail/i, i).fill(h.email);
      if (h.telefone) await this.campo(/telefone|celular/i, i).fill(h.telefone);
      if (h.documento) await this.campo(/cpf|documento/i, i).fill(h.documento);
    }
    await this.avancar.first().click();
  }

  async pagarComCartao(tipo: CartaoTipo, opcoes: { omitir?: string } = {}) {
    const c = CARTOES[tipo];
    const campos: Record<string, [RegExp, string]> = {
      'número': [/n[úu]mero do cart[ãa]o|card number/i, c.numero],
      nome: [/nome (impresso|no cart[ãa]o|do titular)/i, c.nome],
      validade: [/validade|expira/i, c.validade],
      CVC: [/cvc|cvv|c[óo]digo de seguran[çc]a/i, c.cvc],
    };
    for (const [chave, [rotulo, valor]] of Object.entries(campos)) {
      if (opcoes.omitir === chave) continue;
      await this.campo(rotulo).fill(valor);
    }
    await this.pagar.first().click();
  }
}
