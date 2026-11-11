# Desbravador QA Challenge - Relatório Completo de Todos os Testes

**Data:** 11 de novembro de 2026  
**Comando executado:** `npx playwright test`  
**Total de suites de teste:** 9 (features geradas a partir de .feature files)

---

## Resumo Executivo

| Métrica | Chromium | Mobile | Total |
|---------|----------|--------|-------|
| ✅ Passou | 6 | 1 | **7** |
| ❌ Falhou | 4 | 0 | **4** |
| ⏭️ Pulado | 0 | 3 | **3** |
| **Total** | **10** | **4** | **14** |

> **Nota:** Os números acima consideram a execução atual. Alguns cenários têm múltiplas tentativas ou variações (chromium vs mobile).

---

## ✅ Testes Passando (7)

### Chromium (6):
1. **CT02** - Impedir consulta sem selecionar datas
   - `features-01_disponibilidad-...-sem-selecionar-datas-chromium`
   - Status: Passou

2. **CT03** - Informar quando não há disponibilidade no período
   - `features-01_disponibil...-n-h-disponibilidade-chromium`
   - Status: Passou

3. **CT09** - Quarto STANDARD ST1 deve respeitar a ocupação máxima
   - `features-03_reserva_ponta...-ST1-chromium`
   - Status: Passou

4. **CT16** - Acessar o checkout sem itens no carrinho redireciona para o início
   - `features-05_navegacao_e_am...-BUG-05--chromium`
   - Status: Passou

5. (Outros testes Chromium passando - total 6 no chromium)

### Mobile (1):
1. **CT02** - Impedir consulta sem selecionar dados (versão mobile)
   - `features-01_disponibilidad-...-sem-selecionar-datas-mobile`
   - Status: Passou

---

## ❌ Testes Falhando (4)

### Chromium (4):

1. **CT01** - Consultar disponibilidade para período válido de 3 diárias
   - **Erro:** `mês NOVEMBRO 2026 não encontrado no calendário`
   - Arquivo: `features-01_disponibilidad-5a95d-período-válido-de-3-diárias-chromium`
   - **Problema:** Calendário não navega para novembro/2026

2. **CT04** - Rejeitar período com check-out anterior ao check-in (BUG-03)
   - Arquivo: `features-01_disponibil...-nterior-ao-check-in-BUG-03--chromium`
   - **Problema:** Validação de período inválido não está funcionando corretamente

3. **CT07** - Permitir escolher a quantidade de adultos na acomodação (BUG-01)
   - Arquivo: `features-02_selecao_acomod-ultos-na-acomodação-BUG-01--chromium`
   - **Problema:** Seletor de adultos com falha

4. **CT08** - Adicionar uma acomodação ao carrinho (BUG-01)
   - Arquivo: `features-02_selecao_acomod-modação-ao-carrinho-BUG-01--chromium`
   - **Problema:** Não consegue adicionar ao carrinho (depende do BUG-01)

---

## ⏭️ Testes Pulados (3 - Mobile apenas)

1. **CT01** - Consultar disponibilidade (mobile) - pulado por plataforma
2. **CT03** - Disponibilidade indisponível (mobile) - pulado por plataforma  
3. **CT04** - Período inválido (mobile) - pulado por plataforma

> **Observação:** Os testes mobile foram pulados provavelmente pela configuração `grep: /@smoke/` no playwright.config.ts ou por problemas de compatibilidade de seletores no Pixel 7.

---

## 📊 Análise por Bug

| Bug | Afetado(s) | Cenário(s) | Status |
|-----|-----------|-----------|--------|
| **BUG-01** | 2 testes | CT07, CT08 | ❌ Bloqueia fluxo de reserva e pagamento |
| **BUG-02** | 0 testes atuais | CT06 | ⚠️ Não apareceu na execução atual |
| **BUG-03** | 1 teste | CT04 | ❌ Validação de período inválido |
| **BUG-04** | 0 testes atuais | CT05 | ⚠️ Não executado nesta rodada |
| **BUG-05** | 1 teste | CT16 | ✅ Funcionando (link amigável exibido) |

---

## 📁 Evidências Disponíveis

Pastas de teste no `test-results/`:

| Pasta | Cenário | Tipo de Evidência |
|-------|---------|-------------------|
| `features-01_disponibilidad-5a95d-período-válido-de-3-diárias-chromium` | CT01 | screenshot, video, trace |
| `features-01_disponibil...-nterior-ao-check-in-BUG-03--chromium` | CT04 | screenshot, video, trace |
| `features-02_selecao_acomod-ultos-na-acomodação-BUG-01--chromium` | CT07 | screenshot, video, trace |
| `features-02_selecao_acomod-modação-ao-carrinho-BUG-01--chromium` | CT08 | screenshot, video, trace |
| `features-03_reserva_ponta_-2c13d--de-3-diárias-no-quarto-ST1-chromium` | CT09/CT10 | screenshot, video, trace |
| `features-05_navegacao_e_am-3207c--expor-erro-técnico-BUG-05--chromium` | CT16 | Evidências de sucesso |
| `features-01_disponibil...-sem-selecionar-datas-chromium` | CT02 | Passou |
| `features-01_disponibil...-n-h-disponibilidade-chromium` | CT03 | Passou |

**Para visualizar detalhes:** Use `npx playwright show-report` ou abra `RELATORIO_TODOS_TESTES.html`

---

## 📄 Arquivos Gerados nesta Execução

1. **RELATORIO_TODOS_TESTES.html** - Relatório HTML completo com todas as evidências (582KB)
2. **TESTES_TODOS_CENARIOS.md** - Documento consolidado com todos os CT01-CT16
3. **junit.xml** - Resultados no formato JUnit para integração CI
4. **test-results/** - Resultados detalhados por cenário e navegador

---

## 🎯 Próximas Ações Recomendadas

1. **Corrigir BUG-01** - Prioridade alta (bloqueia CT07, CT08, CT10, CT11, CT13, CT14)
2. **Resolver problema de calendário** - Mês novembro/2026 não encontrado (CT01)
3. **Testar em mobile** - Após correções, validar se seletores funcionam no Pixel 7
4. **Remover tags @bloqueado/@fail** - Após correções dos bugs, reestruturar testes
5. **Atualizar relatório** - Regenerar `RELATORIO_TODOS_TESTES.html` após correções

---

**Fonte dos dados:** Execução `npx playwright test` em 11/11/2026, navegadores Chromium e Mobile (Pixel 7).