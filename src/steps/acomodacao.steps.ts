import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { resolveDate } from '../support/dates';

Given(
  'que consultei a disponibilidade de {string} a {string} para {int} adultos e {int} criança',
  async ({ reservation, ctx }, ci: string, co: string, adultos: number, criancas: number) => {
    ctx.checkin = resolveDate(ci);
    ctx.checkout = resolveDate(co);
    await reservation.abrirBusca(ctx.checkin, ctx.checkout, adultos, criancas);
    await reservation.aguardarResultado();
    // Pré-condição: precisa haver ao menos um quarto ofertado para avaliar preço/ocupação.
    await expect(reservation.titulosQuartos.first(), 'pré-condição: nenhuma acomodação ofertada no período').toBeVisible();
  },
);

Then(
  'todas as acomodações listadas devem exibir um preço em reais no formato {string}',
  async ({ reservation }, _formato: string) => {
    const precos = await reservation.precos.allInnerTexts();
    expect(precos.length).toBeGreaterThan(0);
    for (const p of precos) {
      expect.soft(p, `preço exibido: "${p}"`).toMatch(/R\$\s?\d{1,3}(\.\d{3})*,\d{2}/);
    }
  },
);

Then('nenhum preço deve conter {string} ou {string}', async ({ reservation }, a: string, b: string) => {
  for (const p of await reservation.precos.allInnerTexts()) {
    expect.soft(p).not.toContain(a);
    expect.soft(p).not.toContain(b);
  }
});

Then('o seletor de adultos de cada acomodação deve oferecer ao menos {int} opção', async ({ reservation }, min: number) => {
  const codigos = await reservation.codigosOfertados();
  for (const codigo of codigos) {
    const opcoes = reservation.card(codigo).locator('select.form-select').first().locator('option');
    expect.soft(await opcoes.count(), `opções de adultos em ${codigo}`).toBeGreaterThanOrEqual(min);
  }
});

When('adiciono a primeira acomodação disponível com {int} adultos', async ({ reservation }, adultos: number) => {
  await reservation.adicionarQuarto(reservation.primeiroCard(), adultos);
});

Then('o resumo da reserva não deve estar vazio', async ({ reservation }) => {
  await expect(reservation.carrinhoVazio).toBeHidden();
});

Then(
  'a acomodação {string} não deve ser ofertada para {int} adultos e {int} criança',
  async ({ reservation }, codigo: string, _adultos: number, _criancas: number) => {
    expect(await reservation.codigosOfertados()).not.toContain(codigo);
  },
);
