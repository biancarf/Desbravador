import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { HOTEL } from '../data/test-data';
import { resolveDate, toBr, toIso } from '../support/dates';

Given('que estou na página inicial do motor de reservas do hotel de testes', async ({ home }) => {
  await home.abrir();
});

When('seleciono check-in em {string} e check-out em {string}', async ({ home, ctx }, ci: string, co: string) => {
  ctx.checkin = resolveDate(ci);
  ctx.checkout = resolveDate(co);
  await home.selecionarPeriodo(ctx.checkin, ctx.checkout);
});

When('informo {int} adultos', async ({ home }, qtd: number) => {
  await home.informarAdultos(qtd);
});

When('informo {int} criança na faixa {string}', async ({ home }, qtd: number, faixa: string) => {
  await home.informarCriancas(qtd, faixa);
});

When('clico em {string}', async ({ page }, nome: string) => {
  await page.getByRole('button', { name: nome }).click();
});

When('clico em {string} sem selecionar datas', async ({ page }, nome: string) => {
  await page.getByRole('button', { name: nome }).click();
});

When(
  'acesso diretamente a busca de {string} a {string} para {int} adultos e {int} criança',
  async ({ reservation, ctx }, ci: string, co: string, adultos: number, criancas: number) => {
    ctx.checkin = resolveDate(ci);
    ctx.checkout = resolveDate(co);
    await reservation.abrirBusca(ctx.checkin, ctx.checkout, adultos, criancas);
  },
);

Then('devo ser direcionado para a etapa {string}', async ({ page }, etapa: string) => {
  await expect(page).toHaveURL(new RegExp(`/hotel-app/${HOTEL.slug}/reservation`));
  await expect(page.getByText(etapa).first()).toBeVisible();
});

Then('o período selecionado deve ser exibido corretamente', async ({ page, ctx }) => {
  const esperado = `${toBr(ctx.checkin!)} - ${toBr(ctx.checkout!)}`;
  await expect(page.getByText(esperado)).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`checkin=${toIso(ctx.checkin!)}&checkout=${toIso(ctx.checkout!)}`));
});

Then(
  'a URL deve refletir {int} adultos e {int} criança na faixa {int}',
  async ({ page }, adultos: number, criancas: number, faixa: number) => {
    const url = new URL(page.url());
    expect(url.searchParams.get('adults')).toBe(String(adultos));
    expect(url.searchParams.get(`child${faixa}`)).toBe(String(criancas));
  },
);

Then('devo ver o alerta {string}', async ({ alert }, texto: string) => {
  await expect(alert.popup).toBeVisible();
  await expect(alert.popup).toContainText(texto);
  await alert.ok.click();
});

Then('devo permanecer na página inicial', async ({ page }) => {
  await expect(page).toHaveURL(new RegExp(`/hotel-app/${HOTEL.slug}/?$`));
});

Then('devo ver a mensagem de período indisponível com orientação de contato', async ({ reservation }) => {
  await reservation.aguardarResultado();
  await expect(reservation.mensagemIndisponivel).toBeVisible();
});

Then('nenhuma acomodação deve ser oferecida', async ({ reservation }) => {
  await expect(reservation.titulosQuartos).toHaveCount(0);
});

Then('devo ver uma mensagem clara de período inválido', async ({ page, alert }) => {
  // Aceita alerta ou mensagem inline — o que não é aceitável é tela vazia
  // ou a mensagem genérica de "entre em contato" (comportamento atual).
  const mensagem = alert.popup.or(page.getByText(/data(s)? inválida|período inválido|check-?out.*(anterior|maior)|data.*passad/i));
  await expect(mensagem.first()).toBeVisible({ timeout: 10_000 });
});
