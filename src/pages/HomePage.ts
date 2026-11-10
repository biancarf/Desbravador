import { expect, type Locator, type Page } from '@playwright/test';
import { HOTEL } from '../data/test-data';
import { toMonthCaption } from '../support/dates';

/**
 * Página inicial do motor (/hotel-app/<slug>): calendário de período + hóspedes.
 * Seletores mapeados no DOM real em 10/11/2026 (calendário jquery-date-range-picker).
 */
export class HomePage {
  readonly adultos: Locator;
  readonly botaoCriancas: Locator;
  readonly verificar: Locator;
  readonly calendario: Locator;

  constructor(private readonly page: Page) {
    this.adultos = page.locator('input[name="calendar-adults"]');
    this.botaoCriancas = page.locator('.btn-children');
    this.verificar = page.getByRole('button', { name: 'Verificar Disponibilidade' });
    this.calendario = page.locator('.date-picker-wrapper');
  }

  async abrir(slug = HOTEL.slug) {
    await this.page.goto(`/hotel-app/${slug}`);
    await expect(this.verificar).toBeVisible();
  }

  /** Avança o calendário até o mês da data e clica no dia. */
  async clicarDia(data: Date) {
    const caption = toMonthCaption(data);
    const tabelaDoMes = this.calendario
      .locator('table.month1, table.month2')
      .filter({ has: this.page.locator('.month-name', { hasText: caption }) });

    for (let i = 0; i < 24 && (await tabelaDoMes.count()) === 0; i++) {
      await this.calendario.locator('.next').first().click();
    }
    await expect(tabelaDoMes, `mês ${caption} não encontrado no calendário`).toHaveCount(1);

    await tabelaDoMes
      .locator('.day.toMonth.valid')
      .filter({ hasText: new RegExp(`^${data.getDate()}$`) })
      .first()
      .click();
  }

  async selecionarPeriodo(checkin: Date, checkout: Date) {
    await this.clicarDia(checkin);
    await this.clicarDia(checkout);
  }

  async informarAdultos(qtd: number) {
    await this.adultos.fill(String(qtd));
  }

  /**
   * Faixas exibidas no dropdown de crianças:
   * faixa1 = "0 até 2 Anos - FREE", faixa2 = "3 até 12 Anos", faixa3 = "13 até 15 Anos".
   */
  async informarCriancas(qtd: number, faixaLabel: string) {
    const faixas: Record<string, string> = {
      '0 até 2 anos': 'faixa1',
      '3 até 12 anos': 'faixa2',
      '13 até 15 anos': 'faixa3',
    };
    const nome = faixas[faixaLabel.trim().toLowerCase()];
    if (!nome) throw new Error(`Faixa etária desconhecida: "${faixaLabel}"`);

    await this.botaoCriancas.click();
    const campo = this.page.locator(`input[name="${nome}"]`);
    await campo.fill(String(qtd));
    await this.botaoCriancas.click(); // fecha o dropdown
    await expect(this.botaoCriancas).toContainText(`${qtd} - Crian`);
  }

  async verificarDisponibilidade() {
    await this.verificar.click();
  }
}
