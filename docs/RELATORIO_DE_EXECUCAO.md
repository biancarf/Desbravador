# Relatório de execução de testes

| Item | Valor |
|---|---|
| Data da execução | 10/11/2026, entre 16h e 17h (horário de Brasília) |
| Ambiente | `https://reservas.desbravador.com.br/hotel-app/desbravador-4-5` (hotel de demonstração, API de homologação) |
| Navegador | Google Chrome (desktop), viewport 1366×607 |
| Tipo de execução | Manual/exploratória, com inspeção das chamadas de API pelo DevTools |
| Massa | Períodos 06/12–10/12/2026, 17/11–20/11/2026 e 11/01–14/01/2027; 2 adultos + 1 criança (faixa 3–12 anos) |

## 1. Resumo

| Resultado | Qtd. | Casos |
|---|---|---|
| ✅ Aprovado | 4 | CT01, CT02, CT03, CT16 |
| ⚠️ Aprovado com ressalva | 1 | CT09 |
| ❌ Reprovado | 6 | CT04, CT05, CT06, CT07, CT08, CT15 |
| ⛔ Bloqueado | 1 | CT10 |
| ⏸️ Não executado (pré-condição inalcançável) | 4 | CT11, CT12, CT13, CT14 |

**Conclusão: não é possível concluir uma reserva no ambiente de testes.** O fluxo do enunciado para no passo 3/4: nenhuma acomodação pode ser adicionada ao carrinho (BUG-01), e as que aparecem mostram preço "R$ NaN,undefined" (BUG-02). O quarto STANDARD ST1 não é ofertado em nenhum período testado e, pelo cadastro, nem comportaria a composição pedida (ver OBS-01).

## 2. Resultado por caso de teste

| ID | Cenário | Resultado | Evidência / observação |
|---|---|---|---|
| CT01 | Consulta válida (06/12 a 10/12, 2A+1C) | ✅ Aprovado | Redirecionou para "Acomodações e tarifas"; período "06/12/2026 - 10/12/2026" exibido; URL com `adults=2&child2=1`. |
| CT02 | Consulta sem datas | ✅ Aprovado | Alerta "Selecione a data no Calendário"; permaneceu na página inicial. |
| CT03 | Período sem disponibilidade (11/01 a 14/01/2027) | ✅ Aprovado | Mensagem "Prezado cliente, para este período, favor entrar em contato com o nosso departamento de reservas". A API retornou disponibilidade 0 para todos os 11 tipos de quarto. |
| CT04 | Check-out antes do check-in | ❌ Reprovado | **BUG-03.** |
| CT05 | Datas no passado | ❌ Reprovado | **BUG-04.** |
| CT06 | Preço válido nas acomodações | ❌ Reprovado | **BUG-02.** Reproduzido nos dois períodos com oferta. |
| CT07 | Seletor de adultos com opções | ❌ Reprovado | **BUG-01.** Os 8 seletores da página têm 0 opções. |
| CT08 | Adicionar acomodação ao carrinho | ❌ Reprovado | **BUG-01.** Alerta "O número mínimo de ocupantes para esta acomodação é 1"; carrinho segue vazio. |
| CT09 | ST1 respeita ocupação máxima | ⚠️ Aprovado com ressalva | O ST1 não foi ofertado para 2A+1C, como esperado. **Ressalva:** a API informa disponibilidade 0 para o ST1 nos períodos testados, então não dá para afirmar que a regra de ocupação foi aplicada; o resultado é inconclusivo quanto à regra. |
| CT10 | Fluxo completo do enunciado | ⛔ Bloqueado | Passos 1 e 2 OK. Passo 3 falha: ST1 inexistente na oferta. Tentativa alternativa com qualquer quarto (C1) falha no passo 4 por causa do BUG-01. |
| CT11–CT14 | Pagamento | ⏸️ Não executado | Etapa inalcançável. Cenários especificados e automatizados. |
| CT15 | Link de hotel inválido | ❌ Reprovado | **BUG-05.** |
| CT16 | Checkout sem carrinho | ✅ Aprovado | `/hotel-app/desbravador-4-5/checkout` redirecionou para a página inicial. |

## 3. Defeitos

Severidade = impacto técnico; prioridade = urgência para o negócio.

### BUG-01 — Impossível adicionar qualquer acomodação: seletor de adultos sem opções

| Campo | Valor |
|---|---|
| Severidade / Prioridade | **Bloqueante / P1** |
| Casos | CT07, CT08, CT10 |
| Reprodutibilidade | 100% (2 períodos, todas as 4 acomodações ofertadas) |

**Passos**
1. Acessar `/hotel-app/desbravador-4-5`.
2. Selecionar 06/12/2026 a 10/12/2026, 2 adultos, 1 criança (3 até 12 anos).
3. Clicar em "Verificar Disponibilidade".
4. Em qualquer acomodação (C1, FAM, FAP, PC1), abrir o seletor "Adulto(s)" e clicar em "Adicionar".

**Esperado:** seletor com as opções de 1 até a capacidade do quarto; acomodação adicionada ao resumo.

**Obtido:** seletor vazio (nenhum `<option>`); ao clicar em "Adicionar", alerta "O número mínimo de ocupantes para esta acomodação é 1"; carrinho permanece vazio. O rótulo "Max" do card também aparece sem número.

**Análise de causa provável:** a resposta de `hotelInfoRQ` traz, para C1, FAM, FAP e PC1, `pessoas.maxocup = "0"` e `pessoas.maxadultos = 0`. O front monta o seletor de 1 até `maxadultos`, logo fica vazio. Há dois problemas combinados:
- **Dados:** cadastro de capacidade zerado nesses tipos de quarto.
- **Front-end:** o motor oferta uma acomodação com capacidade 0 em vez de ocultá-la ou sinalizar erro de configuração, e a mensagem do alerta não ajuda o hóspede.

**Impacto:** nenhuma reserva pode ser concluída. Se o mesmo cadastro existir em um hotel real, a perda de venda direta é total.

### BUG-02 — Preço exibido como "R$ NaN,undefined"

| Campo | Valor |
|---|---|
| Severidade / Prioridade | **Alta / P1** |
| Casos | CT06 |
| Reprodutibilidade | 100% (06/12–10/12 e 17/11–20/11) |

**Passos:** os mesmos do BUG-01, até o passo 3.

**Esperado:** diária média e preço de/por no formato "R$ 1.234,56".

**Obtido:** "R$ NaN,undefined" na diária média e no preço riscado de todas as acomodações.

**Análise:** o formatador de moeda recebe valor ausente (`undefined`) e não trata o caso. Hipótese a confirmar com o time: falta de tarifa cadastrada para esses tipos de quarto no período. Seja qual for a causa no dado, o front nunca deveria renderizar "NaN" ao hóspede: deveria ocultar a acomodação ou exibir "tarifa sob consulta".

**Impacto:** sem preço não há decisão de compra; além disso, oferta sem preço claro conflita com o dever de informação do CDC.

### BUG-03 — Período invertido (check-out antes do check-in) é aceito sem mensagem

| Campo | Valor |
|---|---|
| Severidade / Prioridade | **Média / P2** |
| Casos | CT04 |

**Passos:** acessar `/hotel-app/desbravador-4-5/reservation?checkin=2026-11-20&checkout=2026-11-17&adults=2&child1=0&child2=1&child3=0&voucher=&resident=0`.

**Esperado:** mensagem de período inválido e retorno à seleção de datas.

**Obtido:** a tela exibe "Período selecionado: 20/11/2026 - 17/11/2026" e a área de acomodações fica em branco, sem nenhuma mensagem.

**Observação:** pelo calendário não é possível montar esse período; o problema aparece via link, que é como os hotéis divulgam o motor. Falta validação do lado do servidor/rota.

### BUG-04 — Período no passado é aceito e gera mensagem enganosa

| Campo | Valor |
|---|---|
| Severidade / Prioridade | **Baixa / P3** |
| Casos | CT05 |

**Passos:** acessar a mesma rota com `checkin=2026-11-01&checkout=2026-11-04` (datas anteriores a hoje).

**Esperado:** mensagem de que não é possível reservar datas passadas.

**Obtido:** "Período selecionado: 01/11/2026 - 04/11/2026" e a mensagem genérica "favor entrar em contato com o nosso departamento de reservas", o que induz o hóspede a ligar para o hotel por um período que já passou.

### BUG-05 — URL do enunciado fora do ar e identificador inválido expõe "CONFIG ERROR"

| Campo | Valor |
|---|---|
| Severidade / Prioridade | **Média / P2** (bloqueia o roteiro do desafio; UX ruim para link quebrado) |
| Casos | CT15 |

**Obtido:**
- `https://reservas.desbravador.com.br/1111` → HTTP 404 ("Not Found").
- `https://reservas.desbravador.com.br/hotel-app/1111` → tela com a mensagem técnica "CONFIG ERROR".

**Esperado:** a URL do material de avaliação apontar para um ambiente válido; e, para identificadores inexistentes, uma página amigável ("hotel não encontrado") em vez de jargão interno.

## 4. Observações e divergências de requisito

| ID | Observação | Recomendação |
|---|---|---|
| OBS-01 | **O roteiro do enunciado conflita com o cadastro do quarto ST1.** A API informa para o ST1: ocupação máxima 2, `maxadultos = 0`, não aceita criança de 0–2 nem de 3–12 anos. 2 adultos + 1 criança (3 pessoas) não cabem nele. Além disso, o ST1 teve disponibilidade 0 em todos os períodos testados. Existe um tipo "STANDARD" de código **STD** (até 4 pessoas), mas também sem disponibilidade. | Alinhar com o PO qual quarto/composição o roteiro pretende cobrir. O comportamento correto do sistema para "3 pessoas no ST1" é **recusar**. |
| OBS-02 | **"Criança até 05 anos" não corresponde a nenhuma faixa do motor.** As faixas são 0–2 (FREE), 3–12 e 13–15. Adotei a faixa 3–12 (criança de 5 anos). | Esclarecer a intenção: se o objetivo era testar criança gratuita, a faixa correta é 0–2. |
| OBS-03 | **O cartão do enunciado está vencido** (validade 12/23; hoje é 11/2026). O resultado esperado com ele é recusa, não aprovação. | Atualizar a massa do desafio. A automação já trata os dois casos (CT11 e CT12). |
| OBS-04 | **Suspeita de off-by-one na disponibilidade:** para uma estadia de 17/11 a 20/11 (3 noites), a consulta `disponibilidadeRQ` envia `datafim = 20/11` e a resposta traz disponibilidade também para 20/11, a data de saída. Se o motor exigir disponibilidade no dia do check-out, um quarto lotado só a partir de 20/11 bloquearia uma venda válida. | Confirmar com o desenvolvimento se a noite do check-out entra no cálculo. Caso entre, é bug de receita. |
| OBS-05 | Campo "Adultos" vazio é tratado silenciosamente como 1 adulto (URL `adults=1`). | Aceitável como padrão, mas o campo deveria vir preenchido com 1 para o hóspede ver o que está sendo pesquisado. |

## 5. Achados de segurança

Durante a análise da camada de API foram identificados achados de segurança que **não estão descritos neste repositório público** de propósito (divulgação responsável). Foram reportados separadamente à equipe da Desbravador.

## 6. Status da automação

| Item | Status |
|---|---|
| Cenários Gherkin | 16 cenários / 19 execuções em `features/` |
| Geração BDD (`bddgen`) | ✅ Todos os steps têm definição (`missingSteps: fail-on-gen`) |
| Typecheck (`tsc`) | ✅ Sem erros |
| Listagem (`playwright test --list`) | ✅ 19 testes no Chromium + 2 `@smoke` no projeto mobile |
| Seletores das etapas busca e acomodações | Mapeados no DOM real |
| Seletores das etapas hóspedes e pagamento | Semânticos (label/placeholder), **não validados no DOM** por estarem inalcançáveis; primeira tarefa após a correção do BUG-01 |

**Resultado esperado de `npm test` no estado atual do ambiente:** suíte verde, com CT04–CT08, CT10 e CT15 reportados como *expected failures* (`@fail` — os bugs continuam presentes) e CT11–CT14 como *fixme* (`@nao-executavel`). Quando um bug for corrigido, o teste correspondente passa a falhar com a mensagem de que o teste marcado como falho passou, sinalizando para remover a tag.
