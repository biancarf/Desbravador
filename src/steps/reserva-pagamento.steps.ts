import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import type { CartaoTipo } from '../data/test-data';
import { resolveDate } from '../support/dates';

When(
  'adiciono a acomodação {string} com {int} adultos e {int} criança',
  async ({ reservation }, codigo: string, adultos: number, criancas: number) => {
    await reservation.aguardarResultado();
    const card = reservation.card(codigo);
    await expect(card, `acomodação ${codigo} não ofertada no período`).toBeVisible();
    await reservation.adicionarQuarto(card, adultos, criancas);
    await expect(reservation.carrinhoVazio).toBeHidden();
  },
);

When('avanço para a identificação dos hóspedes', async ({ checkout }) => {
  await checkout.avancarParaHospedes();
});

When('preencho os dados dos hóspedes da reserva', async ({ checkout }) => {
  await checkout.preencherHospedes();
});

When('pago com o cartão de crédito {string}', async ({ checkout }, tipo: string) => {
  await checkout.pagarComCartao(tipo as CartaoTipo);
});

Then('devo ver a confirmação da reserva com o código gerado', async ({ checkout, page }) => {
  await expect(page).toHaveURL(/\/success/, { timeout: 30_000 });
  await expect(checkout.confirmacao.first()).toBeVisible();
});

// ---------- Pagamento (CT11–CT14) ----------

Given('que tenho uma reserva no carrinho e os hóspedes já informados', async ({ reservation, checkout, page, ctx }) => {
  ctx.checkin = resolveDate('hoje+7');
  ctx.checkout = resolveDate('hoje+10');
  await reservation.abrirBusca(ctx.checkin, ctx.checkout, 2, 1);
  await reservation.aguardarResultado();
  await reservation.adicionarQuarto(reservation.primeiroCard(), 2, 1);
  ctx.totalResumo = (await page.getByText(/total/i).last().innerText()).trim();
  await checkout.avancarParaHospedes();
  await checkout.preencherHospedes();
});

Then('o valor cobrado deve ser igual ao total exibido no resumo', async ({ page, ctx }) => {
  const valor = ctx.totalResumo?.match(/R\$\s?[\d.,]+/)?.[0];
  expect(valor, 'total do resumo não capturado').toBeTruthy();
  await expect(page.getByText(valor!)).toBeVisible();
});

Then('devo ver uma mensagem de cartão vencido ou pagamento recusado', async ({ checkout }) => {
  await expect(checkout.erroPagamento.first()).toBeVisible({ timeout: 30_000 });
});

Then('a reserva não deve ser confirmada', async ({ page }) => {
  await expect(page).not.toHaveURL(/\/success/);
});

When('tento pagar deixando o campo {string} em branco', async ({ checkout }, campo: string) => {
  await checkout.pagarComCartao('aprovado', { omitir: campo });
});

Then('devo ver a validação de campo obrigatório para {string}', async ({ page }, _campo: string) => {
  await expect(page.getByText(/obrigat[óo]rio|preencha|inválid/i).first()).toBeVisible();
});

Then('o pagamento não deve ser enviado ao gateway', async ({ ctx }) => {
  expect(ctx.requisicoesPagamento).toBe(0);
});

When('clico duas vezes rapidamente no botão de pagamento com um cartão válido', async ({ checkout }) => {
  await checkout.pagarComCartao('aprovado');
  await checkout.pagar.first().click({ force: true, timeout: 2_000 }).catch(() => {
    /* botão desabilitado após o 1º clique é o comportamento esperado */
  });
});

Then('apenas uma reserva deve ser criada', async ({ ctx }) => {
  expect(ctx.requisicoesPagamento).toBeLessThanOrEqual(1);
});
