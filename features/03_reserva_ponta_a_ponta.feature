# language: pt
@e2e
Funcionalidade: Reserva completa (fluxo do enunciado)
  Como hóspede
  Quero concluir uma reserva pagando com cartão de crédito
  Para garantir minha hospedagem

  # Fluxo exigido pelo desafio, passo a passo:
  # 1. acessar o motor  2. disponibilidade >= 3 dias  3. quarto STANDARD ST1
  # 4. 2 adultos + 1 criança até 5 anos  5. dados dos hóspedes  6. pagamento com cartão
  #
  # STATUS: BLOQUEADO no passo 3/4 (ver BUG-01 e CT09). O cenário fica marcado
  # com @fail: o teste PASSA enquanto o bug existir e passa a FALHAR (alertando
  # o time) no dia em que o fluxo voltar a funcionar — aí basta remover a tag.

  @critico @smoke @bloqueado @fail
  Esquema do Cenário: CT10 - Concluir reserva de <diarias> diárias no quarto <quarto>
    Dado que estou na página inicial do motor de reservas do hotel de testes
    Quando seleciono check-in em "hoje+7" e check-out em "hoje+<checkout>"
    E informo 2 adultos
    E informo 1 criança na faixa "3 até 12 Anos"
    E clico em "Verificar Disponibilidade"
    E adiciono a acomodação "<quarto>" com 2 adultos e 1 criança
    E avanço para a identificação dos hóspedes
    E preencho os dados dos hóspedes da reserva
    E pago com o cartão de crédito "aprovado"
    Então devo ver a confirmação da reserva com o código gerado

    Exemplos:
      | quarto | diarias | checkout |
      | ST1    | 3       | 10       |
