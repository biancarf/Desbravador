import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from './pages/HomePage';
import { ReservationPage } from './pages/ReservationPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AlertModal } from './pages/AlertModal';

/** Estado compartilhado entre os steps de um mesmo cenário. */
export type ScenarioContext = {
  checkin?: Date;
  checkout?: Date;
  totalResumo?: string;
  requisicoesPagamento: number;
};

type Fixtures = {
  home: HomePage;
  reservation: ReservationPage;
  checkout: CheckoutPage;
  alert: AlertModal;
  ctx: ScenarioContext;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => use(new HomePage(page)),
  reservation: async ({ page }, use) => use(new ReservationPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  alert: async ({ page }, use) => use(new AlertModal(page)),
  ctx: async ({ page }, use) => {
    const ctx: ScenarioContext = { requisicoesPagamento: 0 };
    // Conta chamadas de pagamento/efetivação ao back-end (CT13/CT14).
    page.on('request', (req) => {
      if (req.method() === 'POST' && /pagamento|cartao|efetivar|reservaRQ/i.test(req.postData() ?? '')) {
        ctx.requisicoesPagamento++;
      }
    });
    await use(ctx);
  },
});

export const { Given, When, Then, Before } = createBdd(test);

/**
 * Cenários especificados mas sem pré-condição alcançável no ambiente atual.
 * Ficam visíveis no relatório como "fixme" (em vez de sumirem da suíte).
 * Remover a tag do .feature quando o BUG-01 for corrigido.
 */
Before({ tags: '@nao-executavel' }, async ({ $testInfo }) => {
  $testInfo.fixme(true, 'Etapa inalcançável: BUG-01 impede adicionar acomodação ao carrinho');
});
