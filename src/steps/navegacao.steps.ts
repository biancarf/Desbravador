import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';
import { HOTEL } from '../data/test-data';

When('acesso o motor de reservas com o identificador {string}', async ({ page }, slug: string) => {
  await page.goto(`/hotel-app/${slug}`);
  await page.waitForLoadState('networkidle');
});

Then('não devo ver a mensagem técnica {string}', async ({ page }, msg: string) => {
  await expect(page.getByText(msg)).toHaveCount(0);
});

Then('devo ver uma mensagem amigável de hotel não encontrado', async ({ page }) => {
  await expect(page.getByText(/hotel não encontrado|endereço inválido|link inválido/i)).toBeVisible();
});

When('acesso diretamente a etapa de checkout sem ter adicionado acomodação', async ({ page }) => {
  await page.goto(`/hotel-app/${HOTEL.slug}/checkout`);
});

Then('devo ser redirecionado para a página inicial do hotel', async ({ page }) => {
  await expect(page).toHaveURL(new RegExp(`/hotel-app/${HOTEL.slug}/?$`), { timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Verificar Disponibilidade' })).toBeVisible();
});
