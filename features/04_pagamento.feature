# language: pt
@pagamento @nao-executavel
Funcionalidade: Pagamento com cartão de crédito
  Como hóspede
  Quero pagar minha reserva com cartão de crédito
  Para confirmá-la imediatamente

  # Por que esta funcionalidade é crítica:
  # é o ponto de conversão e de risco financeiro. Falhas aqui geram reserva
  # confirmada sem pagamento, cobrança sem reserva, ou dados de cartão mal tratados.
  #
  # STATUS: NÃO EXECUTÁVEL nesta rodada — a etapa de pagamento é inalcançável
  # por causa do BUG-01. Cenários especificados e automatizados, marcados @nao-executavel (fixme via hook em src/fixtures.ts).
  #
  # ATENÇÃO aos dados de teste do enunciado: o cartão tem validade 12/23.
  # Em nov/2026 ele está VENCIDO, então o resultado esperado com esse cartão
  # é RECUSA — o enunciado espera sucesso. Divergência registrada no relatório.

  Contexto:
    Dado que tenho uma reserva no carrinho e os hóspedes já informados

  @critico
  Cenário: CT11 - Pagamento aprovado com cartão válido confirma a reserva
    Quando pago com o cartão de crédito "aprovado"
    Então devo ver a confirmação da reserva com o código gerado
    E o valor cobrado deve ser igual ao total exibido no resumo

  @critico @negativo
  Cenário: CT12 - Cartão vencido (dado do enunciado, validade 12/23) deve ser recusado
    Quando pago com o cartão de crédito "enunciado"
    Então devo ver uma mensagem de cartão vencido ou pagamento recusado
    E a reserva não deve ser confirmada

  @negativo
  Esquema do Cenário: CT13 - Validar campos obrigatórios do cartão
    Quando tento pagar deixando o campo "<campo>" em branco
    Então devo ver a validação de campo obrigatório para "<campo>"
    E o pagamento não deve ser enviado ao gateway

    Exemplos:
      | campo    |
      | número   |
      | nome     |
      | validade |
      | CVC      |

  @critico
  Cenário: CT14 - Duplo clique em "Pagar" não gera cobrança nem reserva duplicada
    Quando clico duas vezes rapidamente no botão de pagamento com um cartão válido
    Então apenas uma reserva deve ser criada
