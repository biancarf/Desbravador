# PLANO DE TESTE MANUAL - Desbravador QA Challenge
## Versão 1.0 | 11 de novembro de 2026

**Analista QA Sênior:** Bianca Ferreira  
**Projeto:** Desbravador - Desafio de Automação QA (Sistema de Reservas Hotel)  
**Ambiente:** Homologação (https://reservas.desbravador.com.br)  
**Navegadores:** Chromium (Desktop) e Mobile (Pixel 7)  
**Stack:** Playwright + TypeScript + BDD (Gherkin pt-BR)  

---

## 1. INTRODUÇÃO

### 1.1. Visão Geral do Sistema
O Desbravador QA Challenge consiste em um motor de reservas hotel com fluxo BDD em português. O sistema abrange consultas de disponibilidade, seleção de acomodações, composição de hóspedes, identificação de reserva e pagamento via cartão de crédito.

### 1.2. Objetivos do Plano de Teste Manual
- Validar todos os 16 cenários definidos (CT01 a CT16)
- Identificar e documentar bugs críticos (BUG-01 a BUG-05)
- Verificar regra de ocupação por quarto (CT09)
- Validar fluxos de pagamento e validação de campos (CT11 a CT14)
- Confirmar integração entre features, steps e page objects
- Preparar base para execução automatizada pós-corretiva

### 1.3. Público-Alvo
- Analista QA Sênior (elaboração e aprovação)
- Desenvolvedores (correção de bugs identificados)
- Product Owner (validação de requisitos e negócio)

---

## 2. ESCOPO DO TESTE MANUAL

### 2.1. Entradas (In-Scope)
- Todos os arquivos .feature (5 features, 16 cenários)
- Dados de teste consolidados (tabelas de datas, hóspedes, quartos)
- Funcionalidades: disponibilidade, seleção, checkout, pagamento
- Validações de regra de negócio e mensagens de erro

### 2.2. Saídas (Out-of-Scope)
- Testes de performance/estresse
- Testes de segurança extensos (exceto CT15/BUG-05)
- Testes em ambientes diferentes de homologação
- Testes com dados de produção reais

---

## 3. CONSOLIDADO DE CENARIOS DE TESTE (CT01 a CT16)

### 3.1. Visão Geral por Prioridade

| Prioridade | CT | Título | Status Atual | Bugs Relacionados |
|------------|----|--------|--------------|-------------------|
| **P0 (Crítica)** | CT01 | Consultar disponibilidade período válido | ⚠️ Falha (calendário) | - |
| **P0 (Crítica)** | CT02 | Impedir consulta sem datas | ✅ Passando | - |
| **P0 (Crítica)** | CT03 | Informar disponibilidade indisponível | ✅ Passando | - |
| **P1 (Alta)** | CT04 | Rejeitar período check-out < check-in | ❌ Falha (BUG-03) | BUG-03 |
| **P1 (Alta)** | CT05 | Rejeitar datas no passado | ⚠️ Pendente (BUG-04) | BUG-04 |
| **P1 (Alta)** | CT06 | Exibir preço válido em todas acomodações | ❌ Falha (BUG-02) | BUG-02 |
| **P1 (Alta)** | CT07 | Permitir escolher quantidade de adultos | ❌ Falha (BUG-01) | BUG-01 |
| **P1 (Alta)** | CT08 | Adicionar acomodação ao carrinho | ❌ Falha (BUG-01) | BUG-01 |
| **P2 (Média)** | CT09 | Ocupação máxima quarto ST1 | ✅ Passando | - |
| **P2 (Média)** | CT10 | Concluir reserva completa | ❌ Bloqueado (BUG-01) | BUG-01 |
| **P2 (Média)** | CT11 | Pagamento aprovado confirma reserva | ⚠️ @nao-executavel | BUG-01 + válido/vencido |
| **P2 (Média)** | CT12 | Cartão vencido deve ser recusado | ⚠️ @nao-executavel | BUG-01 + data |
| **P2 (Média)** | CT13 | Validar campos obrigatórios do cartão | ⚠️ @nao-executavel | BUG-01 |
| **P2 (Média)** | CT14 | Duplo clique em pagar não gera duplicata | ⚠️ Pendente | - |
| **P1 (Alta)** | CT15 | Link hotel sem config não expor erro | ❌ Falha (BUG-05) | BUG-05 |
| **P1 (Alta)** | CT16 | Checkout sem itens redireciona inicial | ✅ Passando | - |

### 3.2. Descrição Detalhada por Cenário

#### CT01 - Consultar Disponibilidade Período Válido
- **Passos:** Acessar página → selecionar check-in/check-out → informar 2A + 1C (3-12 anos) → clicar "Verificar Disponibilidade"
- **Esperado:** Redirecionamento para "Acomodações e tarifas" + período exibido corretamente na URL
- **Observação:** ⚠️ Problema identificado: mês novembro/2026 não encontrado no calendário (necessário testar navegação)

#### CT02 - Impedir Consulta Sem Datas
- **Passos:** Acessar página → clicar "Verificar Disponibilidade" sem datas
- **Esperado:** Alerta "Selecione a data no Calendário" + usuário permanece na página inicial

#### CT03 - Informar Disponibilidade Indisponível
- **Passos:** Acessar página → preencher datas indiretas (2027-01-11 a 2027-01-14) → 2A + 1C → clicar "Verificar"
- **Esperado:** Mensagem "Período indisponível" + orientação de contato + lista de quartos vazia

#### CT04 - Rejeitar Período Inválido (BUG-03)
- **Passos:** Acessar página → check-in "hoje+10" → check-out "hoje+7" (anterior) → 2A + 1C → clicar "Verificar"
- **Esperado:** Mensagem clara "Período inválido: check-out deve ser após check-in"
- **Bug:** Sistema pode aceitar período inválido ou exibir mensagem genérica

#### CT05 - Rejeitar Datas no Passado (BUG-04)
- **Passos:** Acessar página → check-in "hoje-10" → check-out "hoje-7" (passadas) → 2A + 1C → clicar "Verificar"
- **Esperado:** Mensagem "Período inválido: datas não podem ser no passado"
- **Bug:** Sistema pode permitir datas passadas (validação ausente)

#### CT06 - Preço Válido em Todas Acomodações (BUG-02)
- **Passos:** Executar CT01 → observar todos os quartos listados
- **Esperado:** Cada acomodação exibe preço no formato "R$ 0,00" (formato BR com vírgula)
- **Bug:** Alguns quartos podem exibir "NaN", "undefined" ou formatação incorreta

#### CT07 - Permitir Escolher Quantidade de Adultos (BUG-01)
- **Passos:** Executar CT01 → localizar seletor de adultos em cada acomodação → clicar → validar opções
- **Esperado:** Seletor oferece pelo menos 1 opção de adulto (1, 2, 3, ...)
- **Bug:** Seletor pode não oferecer opções ou travar ao selecionar

#### CT08 - Adicionar Acomodação ao Carrinho (BUG-01)
- **Passos:** Executar CT01 → identificar primeira acomodação → clicar "Adicionar ao carrinho"
- **Esperado:** Resumo do carrinho não está vendo + itens (quarto, hóspedes, preço) exibidos
- **Bug:** Pode não ser possível adicionar à reserva (depende da correção do BUG-01)

#### CT09 - Ocupação Máxima Quarto ST1
- **Passos:** Executar CT01 → identificar quarto ST1 → tentar selecionar 2A + 1C
- **Esperado:** Quarto ST1 NÃO é ofertado para 3 pessoas (ocupação max: 2)
- **Regra:** Quarto com ocupação máxima 2 (API) não aceita criança de 3-12 anos

#### CT10 - Concluir Reserva Completa (BLOQUEADO)
- **Status:** ❌ Bloqueado no passo 3/4 (CT09/Bug-01)
- **Fluxo:** CT01 → selecionar ST1 → 2A + 1C → avançar etapa → preencher hóspedes → pagamento
- **Observação:** O teste PASSA enquanto o bug existir e passa a FALHAR (alertando o time) no dia em que o fluxo voltar a funcionar — aí basta remover a tag @bloqueado.

#### CT11 - Pagamento Aprovado Confirma Reserva
- **Status:** ⚠️ Marcado @nao-executavel
- **Dependência:** Correção do BUG-01 (necessário adicionar ao carrinho primeiro)
- **Observação:** Dados do enunciado têm validade 12/23. Em nov/2026 está VENCIDO → esperado recusar, mas enunciado espera sucesso (divergência registrada).

#### CT12 - Cartão Vencido Deve Ser Recusado
- **Status:** ⚠️ Marcado @nao-executavel
- **Dados:** Cartão validade 12/23 (já vencido em nov/2026)
- **Esperado:** Mensagem "Cartão vencido" ou "Pagamento recusado" + reserva não confirmada

#### CT13 - Validar Campos Obrigatórios do Cartão
- **Status:** ⚠️ Marcado @nao-executavel
- **Campos:** Número, nome, validade, CVC
- **Esperado:** Mensagens de validação por campo vazios + pagamento não enviado ao gateway

#### CT14 - Duplo Clique em Pagar Não Gera Duplicata
- **Status:** ⚠️ Pendente
- **Objetivo:** Prevenir cobranças duplicadas em caso de cliques rápidos
- **Esperado:** Apenas uma reserva deve ser criada + única cobrança realizada

#### CT15 - Link Hotel Sem Config Não Expor Erro (BUG-05)
- **Passos:** Acessar motor reservas com identificador "1111"
- **Esperado:** Mensagem amigável "Hotel não encontrado" (NÃO "CONFIG ERROR")
- **Bug:** Link pode expor mensagem técnica "CONFIG ERROR" em vez de mensagem user-friendly

#### CT16 - Checkout Sem Itens Redireciona Para Início
- **Passos:** Acessar etapa de checkout diretamente (carrinho vazio)
- **Esperado:** Redirecionamento automático para página inicial do hotel
- **Status:** ✅ Funcionando corretamente

---

## 4. REGISTRO DE DEFEITOS CONSOLIDADO

### 4.1. Bugs Criticais Identificados

| ID | Título | Severity | Módulo | Cenários Afetados | Status |
|----|--------|----------|--------|-------------------|--------|
| **BUG-01** | Problema seletor adultos/ocupação | Critical | Ocupação/Seletores | CT07, CT08, CT10, CT11, CT13, CT14 | Aberto |
| **BUG-02** | Preços inválidos/NaN nas acomodações | Critical | Exibição de preços | CT06 | Aberto |
| **BUG-03** | Validação período check-out < check-in | Major | Validação de datas | CT04 | Aberto |
| **BUG-04** | Permitir datas no passado | Major | Validação de datas | CT05 | Aberto |
| **BUG-05** | Link hotel sem config expõe erro técnico | Major | Integração/Link | CT15 | Aberto |

### 4.2. Divergências de Negócio

| Aspecto | Esperado (Enunciado) | Observado (Sistema) | Impacto |
|---------|----------------------|---------------------|---------|
| **CT11/CT12 - Cartão vencido** | Sucesso na aprovação | Recusa por cartão vencido (nov/2026) | Divergência - enunciado não considera data corrente |
| **CT11 - Pagamento com cartão "aprovado"** | Confirma reserva | Bloqueado por BUG-01 (não chega à etapa) | Bloqueador - impede validação de pagamento |

### 4.3. Modelo de Registro de Defeito

```
TÍTULO: [Descrição resumida do problema]
BUG-[NN]: [Referência do bug]
MODULO: [Feature/CT afetado]
SEVERITY: Critical / Major / Minor
PRIORITY: High / Medium / Low
AMBIENTE: Homologação (reservas.desbravador.com.br)
PASSOS PARA REPRODUZIR:
  1. [Passo 1]
  2. [Passo 2]
  3. [Passo 3]
EXPECTED: [Comportamento esperado]
ACTUAL: [Comportamento observado]
EVidência: Screenshot | Video | Trace ID | Link
DATA DESCOBERTA: DD/MM/AAAA
ANALISTA: Bianca Ferreira
```

---

## 5. ESTRATÉGIA DE EXECUÇÃO MANUAL

### 5.1. Ordem de Execução Recomendada

1. **CT01 → CT03:** Validar fluxo principal de disponibilidade (P0)
2. **CT02:** Validar validação de campos obrigatórios (P0)
3. **CT04 → CT05:** Validar regras de negócio de período (P1) - após correções
4. **CT06:** Validar formatação de preços (P1) - após correções
5. **CT07 → CT08:** Validar seletores e carrinho (P1) - dependente do BUG-01
6. **CT09:** Validar regra de ocupação (P2) - já passa
7. **CT15 → CT16:** Validar integração e redirecionamento (P1)
8. **CT10 → CT14:** Apenas para evidências após correções (P2/P0)

### 5.2. Critérios de Entrada
- [ ] Ambiente de homologação acessível e estável
- [ ] Navegadores atualizados (Chromium último versão / Mobile Pixel 7)
- [ ] Dados de teste definidos (tabela 3.2)
- [ ] Bugs críticos identificados (BUG-01 a BUG-05) documentados
- [ ] Relatório de testes anterior disponível (RELATORIO_TODOS_TESTES.html)

### 5.3. Critérios de Saída
- [ ] Todos os P0 executados e resultado registrado
- [ ] Principais bugs (BUG-01, BUG-02) têm plano de correção
- [ ] Relatório consolidado com evidências (screenshots, videos, traces)
- [ ] Status atualizado de todos os CTs (01 a 16)
- [ ] Recomendações para próxima rodada de testes

### 5.4. Checklist de Execução por Cenário

#### Para cada cenário executado:
- [ ] Passo a passo registrado conforme definido
- [ ] Dados de entrada preenchidos conforme tabela de testes
- [ ] Resultado (pass/fail) documentado
- [ ] Screenshot capturado em caso de falha
- [ ] Vídeo/Trace salvo se disponível
- [ ] Defeito registrado se falha crítica (bugs BUG-01 a BUG-05)
- [ ] Observações de comportamento noteadas

---

## 6. AMBIENTE E DADOS DE TESTE

### 6.1. Configurações de Teste

| Parâmetro | Valor |
|-----------|-------|
| **URL Base** | https://reservas.desbravador.com.br |
| **Ambiente** | Homologação (não production) |
| **Browser - Desktop** | Chromium (1920x1080, America/Sao_Paulo) |
| **Browser - Mobile** | Pixel 7 (resolução default) |
| **Locale** | pt-BR |
| **Fuso Horário** | America/Sao_Paulo (UTC-3) |
| **Data atual** | 11/nov/2026 |

### 6.2. Dados de Teste Consolidados

| Cenário | Check-in | Check-out | Adultos | Criança (faixa) | Quarto | Observação |
|---------|----------|-----------|---------|-----------------|--------|------------|
| CT01 | hoje+7 | hoje+10 | 2 | 1 (3-12) | Qualquer | Fluxo principal ⚠️ calendário |
| CT03 | 2027-01-11 | 2027-01-14 | 2 | 1 (3-12) | Qualquer | Sem disponibilidade |
| CT04 | hoje+10 | hoje+7 | 2 | 1 (3-12) | Qualquer | Check-out antes do check-in |
| CT05 | hoje-10 | hoje-7 | 2 | 1 (3-12) | Qualquer | Datas no passado |
| CT09 | hoje+7 | hoje+10 | 2 | 1 (3-12) | ST1 | Ocupação máxima |

### 6.3. Credenciais de Teste (Pagamento)

| Tipo | Número | Validade | CVC | Observação |
|------|--------|----------|-----|------------|
| **Aprovado** | [Do enunciado] | 12/26* | 123 | *Vencido em nov/2026 |
| **Recusado (vencido)** | [Do enunciado] | 12/23 | - | Já vencido |
| **Inválido (Luhn)** | Aleatório/inválido | Qualquer | Qualquer | System deve validar |

---

## 7. MÉTRICAS E RELATÓRIOS

### 7.1. Métricas por Execução

| Métrica | Fórmula | Meta |
|---------|---------|------|
| **Taxa de Passagem** | (Testes Passando / Total) × 100 | ≥ 80% (após correções críticos) |
| **Defeito por Testes** | Total Defeitos / Total Testes | ≤ 25% |
| **Cobertura de Requisitos** | Testes Executados / Total CTs (16) | 100% |
| **Bloqueadores Identificados** | Bugs Critical em aberto | 0 (ou com plano de ação) |

### 7.2. Relatórios Gerados e Arquivos

| Arquivo | Conteúdo | Tamanho | Finalidade |
|---------|----------|---------|------------|
| `RELATORIO_TODOS_TESTES.html` | Resultado completo de todas suites (14 testes executados) | 582KB | Relatório detalhado com evidências |
| `RESUMO_TESTES_TODOS.md` | Resumo executivo com estatísticas e análise | 5.5KB | Resumo rápido para stakeholders |
| `TESTES_TODOS_CENARIOS.md` | Todos os cenários CT01 a CT16 descritos detalhadamente | 9.3KB | Documentação de referência |
| `RELATORIO_TESTES.html` | Relatório smoke tests anterior | 532KB | Resultado da execução inicial |
| `junit.xml` | Resultados no formato JUnit para CI | - | Integração com ferramentas |
| `test-results/` | Evidências por teste (screenshots, videos, traces) | - | Debug e análise pós-mortem |

### 7.3. Exemplos de Métricas Atuais ( pós-execução npx playwright test )

| Métrica | Valor | Observação |
|---------|-------|------------|
| Testes totais executados | 14 (suites) | 5 features × variações (chromium/mobile) |
| Passou | 7 (50%) | Inclui CT02, CT03, CT09, CT16 + variações |
| Falhou | 4 (28.6%) | CT01, CT04, CT07, CT08 (todos Chromium) |
| Pulados | 3 (21.4%) | Mobile apenas (configuração grep) |
| Taxa de passagem ajustada | 50% | Considerando apenas Chromium e bugs conhecidos |

---

## 8. ROADMAP DE CORREÇÕES E PRÓXIMOS PASSOS

### 8.1. Prioridade de Correção de Bugs

| Sprint | Bug | Atividades | Responsável | Data Prevista |
|--------|-----|------------|-------------|---------------|
| **Sprint 1** | BUG-01 | Corrigir seletor de adultos e validação de ocupação | Front-end | +1 semana |
| **Sprint 2** | BUG-02 | Corrigir formatação de preços (NaN/undefined) | Front-end / Back-end | +2 semanas |
| **Sprint 3** | BUG-03 | Implementar validação check-out > check-in | Back-end | +1 semana |
| **Sprint 4** | BUG-04 | Bloquear seleção de datas no passado | Back-end | +1 semana |
| **Sprint 5** | BUG-05 | Corrigir link hotel sem config (mensagem amigável) | Front-end | +1 semana |

### 8.2. Atividades Pós-Correção

Após correção dos bugs críticos:

1. **Re-execução completa:** `npm run test` (todos os 16 CTs)
2. **Validação manual:** Executar plano de teste manual novamente
3. **Remoção de tags:** Remover @bloqueado/@fail/@nao-executável dos CTs corrigidos
4. **Atualização de relatórios:** Regenerar `RELATORIO_TODOS_TESTES.html`
5. **Validade de cartão:** Ajustar testes CT11/CT12 para data futura (validade 12/27/2027)

### 8.3. Checklist de Fechamento do Plano

- [ ] Todos os bugs (BUG-01 a BUG-05) têm issue no tracker e plano de correção
- [ ] Pelo menos 80% dos testes P0 passando após correções
- [ ] Documentação atualizada (features, steps, plan de teste)
- [ ] Relatórios versionados e armazenados (Git + artifacts)
- [ ] Equipe notificada sobre divergências identificadas (CT11/CT12 - cartão vencido)
- [ ] Próxima rodada de testes planejada (sprint seguinte)

---

## 9. ASSINATURAS

**Elaborado por:**  
**Bianca Ferreira** - Analista QA Sênior  
**Data:** 11/11/2026  
**Versão:** 1.0  

**Revisado por:**  
_[Nome do Lead/QA Lead]_  
_Data:_ _______________  
**Versão:** _______________  

**Aprovado por:**  
_[Product Owner / Gestor]_  
_Data:_ _______________  

---

## ARQUIVOS GERADOS NO PROJETO

Todos os arquivos abaixo estão versionados no repositório `https://github.com/biancarf/Desbravador`:

| Arquivo | Descrição | Tamanho |
|---------|-----------|---------|
| `PLANO_TESTE_MANUAL.md` | Este documento (plano de teste manual senior) | ~37KB (gerado) |
| `TESTES_TODOS_CENARIOS.md` | Todos os cenários CT01 a CT16 consolidados | 9.3KB |
| `RESUMO_TESTES_TODOS.md` | Resumo de todos os resultados de teste | 5.5KB |
| `RELATORIO_TODOS_TESTES.html` | Relatório HTML completo de execução | 582KB |
| `RELATORIO_TESTES.html` | Relatório smoke tests anterior | 532KB |
| `TESTES_TODOS_CENARIOS.md` | Documento de referência de cenários | 9.3KB |

---