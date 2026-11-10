# Estratégia de testes e justificativa dos cenários

## 1. Escopo e objeto de teste

| Item | Valor |
|---|---|
| Sistema | Desbravador Reservas Online (motor de reservas — "hotel-app") |
| URL do enunciado | `https://reservas.desbravador.com.br/1111` → **404** em 10/11/2026 |
| URL efetivamente testada | `https://reservas.desbravador.com.br/hotel-app/desbravador-4-5` |
| Por que esse endereço | O motor migrou para o padrão `/hotel-app/<slug>`. `/hotel-app/1111` retorna "CONFIG ERROR". O slug `desbravador-4-5` é o hotel de demonstração da própria Desbravador — o bundle do front-end roteia esse slug para a API de homologação, ou seja, é o ambiente de teste oficial. |
| Fluxo do enunciado | acessar → disponibilidade ≥ 3 dias → quarto STANDARD ST1 → 2 adultos + 1 criança até 5 anos → dados dos hóspedes → pagamento com cartão |

Antes de escrever qualquer cenário, mapeei o fluxo real no navegador (inclusive as respostas da API) para que os cenários testem o sistema que existe hoje, e não uma suposição sobre ele.

## 2. Critério de escolha: risco

Priorizei por **risco = impacto no negócio × probabilidade de falha**, com foco no que o enunciado chama de "cenários críticos". Num motor de reservas, o risco se concentra em quatro pontos:

| Área de risco | Por que importa | O que pode dar errado |
|---|---|---|
| **Funil de conversão** (busca → quarto → hóspedes → pagamento) | Cada etapa quebrada é receita perdida para o hotel, e o hóspede migra para uma OTA (com comissão) | Busca não retorna, quarto não pode ser adicionado, checkout inalcançável |
| **Preço** | A oferta exibida vincula o fornecedor (CDC); preço errado é prejuízo ou reclamação | Valor ausente, mal formatado, diferente do cobrado |
| **Regras de ocupação e faixas etárias** | Define quantas pessoas cabem e quanto pagam | Quarto vendido acima da capacidade, criança cobrada como adulto, bloqueio de venda válida |
| **Pagamento** | Risco financeiro direto e de dados de cartão | Reserva sem pagamento, cobrança em dobro, cartão inválido aceito |

Técnicas aplicadas:

- **Partição de equivalência e valor-limite** nas datas: período válido, sem data, sem disponibilidade, invertido, no passado.
- **Tabela de decisão** para ocupação: composição (adultos × faixa da criança) × capacidade do quarto.
- **Teste de transição de estado** no funil: não deve ser possível pular etapas (checkout sem carrinho).
- **Teste exploratório guiado por sessão** antes da automação, inspecionando também a camada de API — foi isso que revelou a causa raiz do bloqueio e os achados de segurança.

## 3. Cenários e justificativa

O desafio pede no mínimo 4 cenários; entreguei 16 casos (19 execuções, contando os exemplos do esquema CT13), agrupados em 5 funcionalidades. Abaixo, o porquê de cada um.

### 01 — Consulta de disponibilidade (`features/01_disponibilidade.feature`)

| ID | Cenário | Por que escolhi |
|---|---|---|
| CT01 | Consulta válida de 3 diárias, 2 adultos + 1 criança | Passo 2 do enunciado. É a entrada do funil: se falhar, nada mais acontece. Verifica também que a composição de hóspedes é propagada corretamente para a etapa seguinte (URL `adults=2&child2=1`). |
| CT02 | Consulta sem datas | Validação de campo obrigatório mais básica; protege a API de chamadas inválidas. |
| CT03 | Período sem disponibilidade | Caminho alternativo comum (alta temporada). O hóspede precisa de uma resposta clara, não de uma tela vazia. |
| CT04 | Check-out antes do check-in | Valor-limite/dado inválido. O front aceita o período via link compartilhado (deep link), que é exatamente como hotéis divulgam o motor em sites e WhatsApp. |
| CT05 | Datas no passado | Mesmo raciocínio: link antigo salvo pelo hóspede ou manipulação de URL. |

### 02 — Seleção de acomodação (`features/02_selecao_acomodacao.feature`)

| ID | Cenário | Por que escolhi |
|---|---|---|
| CT06 | Preço válido em todas as acomodações | Preço é o dado mais sensível da tela. "R$ NaN" destrói a confiança e impede a decisão de compra. |
| CT07 | Seletor de adultos com opções | Passo 4 do enunciado depende dele; sem opções, não há como informar a ocupação. |
| CT08 | Adicionar acomodação ao carrinho | É a transição entre busca e checkout. É o ponto exato onde o fluxo do enunciado quebra hoje. |
| CT09 | ST1 respeita a ocupação máxima | Regra de negócio. O cadastro do ST1 retornado pela API tem ocupação máxima de 2 e não aceita criança de 3–12 anos. Um teste sênior não deve só "seguir o roteiro": se o roteiro pede 3 pessoas num quarto para 2, o resultado correto é a recusa. |

### 03 — Reserva ponta a ponta (`features/03_reserva_ponta_a_ponta.feature`)

| ID | Cenário | Por que escolhi |
|---|---|---|
| CT10 | Fluxo completo do enunciado (passos 1 a 6) | É o teste de aceitação pedido. Está automatizado de ponta a ponta e marcado `@fail`: hoje ele falha no passo 3 por causa do BUG-01, e no dia em que o fluxo for corrigido o teste avisa o time. |

### 04 — Pagamento (`features/04_pagamento.feature`)

| ID | Cenário | Por que escolhi |
|---|---|---|
| CT11 | Pagamento aprovado confirma a reserva e cobra o valor exibido | Passo 6 do enunciado; garante que valor cobrado = valor ofertado. |
| CT12 | Cartão do enunciado (validade 12/23) deve ser recusado | Em nov/2026 o cartão está vencido. Validar a recusa é tão crítico quanto validar a aprovação. |
| CT13 | Campos obrigatórios do cartão (4 exemplos) | Evita chamadas desnecessárias ao gateway (custo por transação) e erros confusos para o hóspede. |
| CT14 | Duplo clique em "Pagar" | Defeito clássico e caro em checkout: cobrança e reserva duplicadas. |

Todos estão especificados e automatizados, mas marcados `@nao-executavel`: a etapa de pagamento ficou inalcançável na execução (BUG-01).

### 05 — Acesso e integridade do fluxo (`features/05_navegacao_e_ambiente.feature`)

| ID | Cenário | Por que escolhi |
|---|---|---|
| CT15 | Link de hotel inválido não expõe erro técnico | O próprio link do enunciado (`/1111`) cai nesse caso. "CONFIG ERROR" para o hóspede final é erro de UX e vazamento de detalhe interno. |
| CT16 | Checkout sem carrinho redireciona | Garante que não é possível pular etapas obrigatórias por URL. |

## 4. Rastreabilidade com o enunciado

| Passo do enunciado | Cenários |
|---|---|
| 1. Acessar o endereço | CT15 (URL original), CT01 (URL atual) |
| 2. Disponibilidade ≥ 3 dias | CT01, CT02, CT03, CT04, CT05 |
| 3. Quarto STANDARD ST1 | CT09, CT10 |
| 4. 2 adultos + 1 criança até 5 anos | CT01, CT07, CT08, CT09, CT10 |
| 5. Informar os hóspedes | CT10 |
| 6. Pagamento com cartão | CT10, CT11, CT12, CT13, CT14 |

## 5. Decisões técnicas da automação

| Decisão | Motivo |
|---|---|
| **Playwright + playwright-bdd** (TypeScript) | Gherkin nativo executado pelo runner do Playwright: paralelismo, retries, trace viewer, vídeo e relatório HTML sem a cola do Cucumber. |
| **Gherkin em português** (`# language: pt`) | Os cenários servem como documentação viva para PO e negócio. |
| **Page Objects** (`src/pages`) | Seletores num só lugar; os steps falam a língua do negócio. |
| **Datas relativas** (`"hoje+7"`) | A suíte não "apodrece" com o calendário, ao contrário de datas fixas. |
| **`@fail` em bugs conhecidos** | A suíte fica verde e confiável no CI, mas cada bug continua sendo verificado. Se o bug for corrigido, o teste passa a falhar e avisa para remover a tag. É um teste de regressão do próprio bug. |
| **`@nao-executavel`** (fixme via hook) | Cenários sem pré-condição alcançável aparecem no relatório como pendentes em vez de sumirem. |
| **Massa de testes centralizada + `.env`** | Hotel, cartão e hóspedes trocáveis sem tocar no código; nenhum dado real. |
| **CI no GitHub Actions** | Roda em push/PR e diariamente; publica relatório, trace e vídeo como artefatos. |
| **Projeto `mobile`** (Pixel 7) só para `@smoke` | Boa parte das reservas de hotel vem do celular; cobertura mobile no caminho crítico sem dobrar o tempo da suíte. |

## 6. O que eu faria em seguida (pirâmide de testes)

E2E é a camada mais lenta e frágil. Para um motor de reservas, eu complementaria com:

1. **Testes de contrato/API** sobre `interface.php` (`disponibilidadeRQ`, `tarifasRQ`, `hotelInfoRQ`): validariam em segundos que todo quarto ofertado tem ocupação > 0 e tarifa definida. Teriam pego os BUG-01 e BUG-02 sem abrir o navegador.
2. **Validação de cadastro do hotel** (testes de dados): quarto com `maxocup = 0` não deveria ser publicável.
3. **Testes de componente** no front para o formatador de moeda (entrada `undefined` → nunca "NaN").
4. E2E apenas para o caminho feliz e os 3 ou 4 negativos mais caros (o que está aqui).
