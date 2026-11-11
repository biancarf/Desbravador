# Desbravador QA Challenge - Todos os Cenários de Teste

Arquivo consolidado com todos os cenários (CT01 a CT16) extraídos dos arquivos `.feature` do projeto.

---

## Visão Geral

| ID | Tags | Título | Status |
|----|------|--------|--------|
| CT01 | @smoke @critico | Consultar disponibilidade para período válido de 3 diárias | ✅ |
| CT02 | @negativo | Impedir consulta sem selecionar datas | ✅ |
| CT03 | @negativo | Informar quando não há disponibilidade no período | ✅ |
| CT04 | @negativo @bug @fail | Rejeitar período com check-out anterior ao check-in (BUG-03) | ❌ Bug |
| CT05 | @negativo @bug @fail | Rejeitar período com datas no passado (BUG-04) | ❌ Bug |
| CT06 | @critico @bug @fail | Exibir preço válido em todas as acomodações ofertadas (BUG-02) | ❌ Bug |
| CT07 | @critico @bug @fail | Permitir escolher a quantidade de adultos na acomodação (BUG-01) | ❌ Bug |
| CT08 | @critico @bug @fail | Adicionar uma acomodação ao carrinho (BUG-01) | ❌ Bug |
| CT09 | @regra-de-negocio @dados | Quarto STANDARD ST1 deve respeitar a ocupação máxima | ⚠️ Regra |
| CT10 | @critico @smoke @bloqueado @fail | Concluir reserva completa no quarto ST1 (BLOQUEADO) | ❌ Bloqueado |
| CT11 | @critico | Pagamento aprovado com cartão válido confirma a reserva | ⚠️ @nao-executavel |
| CT12 | @critico @negativo | Cartão vencido (dado do enunciado, validade 12/23) deve ser recusado | ⚠️ @nao-executavel |
| CT13 | @critico | Validar campos obrigatórios do cartão | ⚠️ @nao-executavel |
| CT14 | @critico | Duplo clique em "Pagar" não gera cobrança nem reserva duplicada | ⚠️ Pendente |
| CT15 | @ambiente @bug @fail | Link do hotel sem configuração não deve expor erro técnico (BUG-05) | ❌ Bug |
| CT16 | @seguranca | Acessar o checkout sem itens no carrinho redireciona para o início | ✅ |

---

## Descrição Detalhada de Cada Cenário

### CT01 - Consultar disponibilidade para período válido de 3 diárias
**Tags:** @smoke @critico  
**Cenário:** Quando seleciono check-in em "hoje+7" e check-out em "hoje+10", E informo 2 adultos, E informo 1 criança na faixa "3 até 12 Anos", E clico em "Verificar Disponibilidade", Então devo ser direcionado para a etapa "Acomodações e tarifas", E o período selecionado deve ser exibido corretamente, E a URL deve refletir 2 adultos e 1 criança na faixa 2.

### CT02 - Impedir consulta sem selecionar datas
**Tags:** @negativo  
**Cenário:** Quando clico em "Verificar Disponibilidade" sem selecionar datas, Então devo ver o alerta "Selecione a data no Calendário", E devo permanecer na página inicial.

### CT03 - Informar quando não há disponibilidade no período
**Tags:** @negativo  
**Cenário:** Quando acesso diretamente a busca de "2027-01-11" a "2027-01-14" para 2 adultos e 1 criança, Então devo ver a mensagem de período indisponível com orientação de contato, E nenhuma acomodação deve ser oferecida.

### CT04 - Rejeitar período com check-out anterior ao check-in (BUG-03)
**Tags:** @negativo @bug @fail  
**Cenário:** Quando acesso diretamente a busca de "hoje+10" a "hoje+7" para 2 adultos e 1 criança, Então devo ver uma mensagem clara de período inválido.  
**Status:** ❌ Bug reportado - precisa de correção no backend.

### CT05 - Rejeitar período com datas no passado (BUG-04)
**Tags:** @negativo @bug @fail  
**Cenário:** Quando acesso diretamente a busca de "hoje-10" a "hoje-7" para 2 adultos e 1 criança, Então devo ver uma mensagem clara de período inválido.  
**Status:** ❌ Bug reportado - validação de datas permitindo passado.

### CT06 - Exibir preço válido em todas as acomodações ofertadas (BUG-02)
**Tags:** @critico @bug @fail  
**Cenário:** Todas as acomodações listadas devem exibir um preço em reais no formato "R$ 0,00", E nenhum preço deve conter "NaN" ou "undefined".  
**Status:** ❌ Bug - preços inválidos sendo exibidos.

### CT07 - Permitir escolher a quantidade de adultos na acomodação (BUG-01)
**Tags:** @critico @bug @fail  
**Cenário:** O seletor de adultos de cada acomodação deve oferecer ao menos 1 opção.  
**Status:** ❌ Bug - problema no seletor de ocupação.

### CT08 - Adicionar uma acomodação ao carrinho (BUG-01)
**Tags:** @critico @bug @fail  
**Cenário:** Quando adiciono a primeira acomodação disponível com 2 adultos, Então o resumo da reserva não deve estar vazio.  
**Status:** ❌ Bug - não consegue adicionar ao carrinho.

### CT09 - Quarto STANDARD ST1 deve respeitar a ocupação máxima
**Tags:** @regra-de-negocio @dados  
**Cenário:** O quarto ST1 tem ocupação máxima 2, sem aceitar criança de 3-12 anos. O enunciado pede 2 adultos + 1 criança no ST1 (3 pessoas): o comportamento CORRETO do sistema é NÃO permitir essa composição nesse quarto.  
**Status:** ⚠️ Regra de negócio - validação de ocupação por quarto implementada.

### CT10 - Concluir reserva completa no quarto ST1 (BLOQUEADO)
**Tags:** @critico @smoke @bloqueado @fail  
**Esquema:** Cenário parametrizado com exemplos (quarto: ST1, diarias: 3, checkout: 10).  
**Fluxo:** Acessar página inicial → selecionar período → informar adultos → verificar disponibilidade → adiciono acomodação ST1 com 2 adultos e 1 criança → avançar para identificação dos hóspedes → preencher dados dos hóspedes → pagar com cartão de crédito "aprovado".  
**Resultado esperado:** Devo ver a confirmação da reserva com o código gerado.  
**Status:** ❌ **BLOQUEADO** - Para no passo 3/4 (CT09/Bug-01). O teste PASSA enquanto o bug existir e passa a FALHAR (alertando o time) no dia em que o fluxo voltar a funcionar — aí basta remover a tag @bloqueado.

### CT11 - Pagamento aprovado com cartão válido confirma a reserva
**Tags:** @critico  
**Cenário:** Quando pago com o cartão de crédito "aprovado", Então devo ver a confirmação da reserva com o código gerado, E o valor cobrado deve ser igual ao total exibido no resumo.  
**Status:** ⚠️ **@nao-executavel** - A etapa de pagamento é inalcançável por causa do BUG-01. Cenários especificados e automatizados, marcados @nao-executavel (fixme via hook em src/fixtures.ts).  
**Atenção:** Os dados de teste do enunciado têm validade 12/23. Em nov/2026 o cartão está VENCIDO, então o resultado esperado com esse cartão é RECUSA — há divergência registrada no relatório entre o enunciado (que espera sucesso) e o comportamento real (recusa por cartão vencido).

### CT12 - Cartão vencido (dado do enunciado, validade 12/23) deve ser recusado
**Tags:** @critico @negativo  
**Cenário:** Quando pago com o cartão de crédito "enunciado", Então devo ver uma mensagem de cartão vencido ou pagamento recusado, E a reserva não deve ser confirmada.  
**Status:** ⚠️ **@nao-executavel** - Mesmo com cartão vencido, o sistema ainda tenta processar.

### CT13 - Validar campos obrigatórios do cartão
**Tags:** @critico  
**Esquema do Cenário:** Quando tento pagar deixando o campo "<campo>" em branco, Então devo ver a validação de campo obrigatório para "<campo>", E o pagamento não deve ser enviado ao gateway.  
**Exemplos:** número, nome, validade, CVC.  
**Status:** ⚠️ **@nao-executavel** - Bloqueado pelo BUG-01 (não chega à etapa de pagamento).

### CT14 - Duplo clique em "Pagar" não gera cobrança nem reserva duplicada
**Tags:** @critico  
**Cenário:** Quando clico duas vezes rapidamente no botão de pagamento com um cartão válido, Então apenas uma reserva deve ser criada.  
**Status:** ⚠️ **Pendente** - Ainda não executado (depende da correção do BUG-01).

### CT15 - Link do hotel sem configuração não deve expor erro técnico (BUG-05)
**Tags:** @ambiente @bug @fail  
**Cenário:** Quando acesso o motor de reservas com o identificador "1111", Então não devo ver a mensagem técnica "CONFIG ERROR", Mas devo ver uma mensagem amigável de hotel não encontrado.  
**Status:** ❌ Bug - link expõe erro técnico em vez de mensagem amigável.

### CT16 - Acessar o checkout sem itens no carrinho redireciona para o início
**Tags:** @seguranca  
**Cenário:** Quando acesso diretamente a etapa de checkout sem ter adicionado acomodação, Então devo ser redirecionado para a página inicial do hotel.  
**Status:** ✅ Funcionando corretamente.

---

## Resumo de Status

| Status | Quantidade | Percentual |
|--------|-----------|------------|
| ✅ Passando | 3 (CT01, CT02, CT03, CT16) | 20% |
| ❌ Falhando/Bug | 5 (CT04, CT05, CT06, CT07, CT08, CT15) | 33% |
| ⚠️ Pendente/Non-executable | 8 (CT09, CT10, CT11, CT12, CT13, CT14) | 53% |

**Total:** 16 cenários (CT01 a CT16)

---

## Prioridades de Correção

1. **BUG-01** - Problema no seletor de adultos/ocupação (afeta CT07, CT08, CT10, CT11, CT13, CT14)
2. **BUG-02** - Preços inválidos exibidos (CT06)
3. **BUG-03** - Validação de check-out anterior ao check-in (CT04)
4. **BUG-04** - Permitir datas no passado (CT05)
5. **BUG-05** - Link de hotel sem configuração expõe erro técnico (CT15)

## Próximos Passos

- Corrigir BUG-01 para liberar fluxo completo (CT10) e etapas de pagamento (CT11, CT12, CT13, CT14)
- Manter @nao-executavel nos cenários de pagamento até correção dos bugs
- Remover tags @bloqueado/@fail após correções e reestruturação dos testes