import { expect, type Locator, type Page } from '@playwright/test';
import { HOTEL } from '../data/test-data';
import { toIso } from '../support/dates';

/** Etapa "Acomodações e tarifas" (/hotel-app/<slug>/reservation?...). */
export class ReservationPage {
  readonly titulosQuartos: Locator;
  readonly precos: Locator;
  readonly periodoSelecionado: Locator;
  readonly carrinhoVazio: Locator;
  readonly mensagemIndisponivel: Locator;

  constructor(private readonly page: Page) {
    this.titulosQuartos = page.locator('p.room-title');
    this.precos = page.locator('.rate-list-content');
    this.periodoSelecionado = page.getByText(/Período selecionado/);
    this.carrinhoVazio = page.locator('.cart-empty-text');
    this.mensagemIndisponivel = page.getByText(/favor entrar em contato com o nosso departamento de reservas/i);
  }

  /** Deep link usado pelo próprio front — útil para testes de borda de datas. */
  async abrirBusca(checkin: Date, checkout: Date, adultos: number, criancasFaixa2: number) {
    const qs = new URLSearchParams({
      checkin: toIso(checkin),
      checkout: toIso(checkout),
      adults: String(adultos),
      child1: '0',
      child2: String(criancasFaixa2),
      child3: '0',
      voucher: '',
      resident: '0',
    });
    await this.page.goto(`/hotel-app/${HOTEL.slug}/reservation?${qs}`);
    await expect(this.periodoSelecionado).toBeVisible();
  }

  /** Aguarda a resposta da busca: ou lista quartos, ou mostra indisponibilidade. */
  async aguardarResultado() {
    await expect(this.titulosQuartos.first().or(this.mensagemIndisponivel)).toBeVisible({ timeout: 20_000 });
  }

  card(codigoQuarto: string): Locator {
    return this.titulosQuartos
      .filter({ hasText: new RegExp(`^\\s*${codigoQuarto}\\s*$`) })
      .locator('xpath=ancestor::div[.//button[contains(@class,"btn-add")]][1]');
  }

  primeiroCard(): Locator {
    return this.titulosQuartos.first().locator('xpath=ancestor::div[.//button[contains(@class,"btn-add")]][1]');
  }

  async codigosOfertados(): Promise<string[]> {
    return (await this.titulosQuartos.allInnerTexts()).map((t) => t.trim());
  }

  async adicionarQuarto(card: Locator, adultos: number, criancas = 0) {
    await card.locator('select.form-select').first().selectOption(String(adultos));
    if (criancas > 0) {
      await card.locator('.button-value').first().click();
      await card.getByLabel(/3 até 12/i).fill(String(criancas));
    }
    await card.locator('.btn-add').first().click();
  }
}
