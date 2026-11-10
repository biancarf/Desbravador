# language: pt
@disponibilidade
Funcionalidade: Consulta de disponibilidade
  Como hóspede em potencial
  Quero consultar a disponibilidade de acomodações para um período
  Para saber se consigo me hospedar nas datas desejadas

  # Por que esta funcionalidade é crítica:
  # é a porta de entrada do funil. Se a busca falha ou aceita dados inválidos,
  # nenhuma reserva acontece (perda de receita direta) ou o hóspede recebe
  # informação errada sobre o período.

  Contexto:
    Dado que estou na página inicial do motor de reservas do hotel de testes

  @smoke @critico
  Cenário: CT01 - Consultar disponibilidade para um período válido de 3 diárias
    Quando seleciono check-in em "hoje+7" e check-out em "hoje+10"
    E informo 2 adultos
    E informo 1 criança na faixa "3 até 12 Anos"
    E clico em "Verificar Disponibilidade"
    Então devo ser direcionado para a etapa "Acomodações e tarifas"
    E o período selecionado deve ser exibido corretamente
    E a URL deve refletir 2 adultos e 1 criança na faixa 2

  @negativo
  Cenário: CT02 - Impedir consulta sem selecionar datas
    Quando clico em "Verificar Disponibilidade" sem selecionar datas
    Então devo ver o alerta "Selecione a data no Calendário"
    E devo permanecer na página inicial

  @negativo
  Cenário: CT03 - Informar quando não há disponibilidade no período
    Quando acesso diretamente a busca de "2027-01-11" a "2027-01-14" para 2 adultos e 1 criança
    Então devo ver a mensagem de período indisponível com orientação de contato
    E nenhuma acomodação deve ser oferecida

  @negativo @bug @fail
  Cenário: CT04 - Rejeitar período com check-out anterior ao check-in (BUG-03)
    Quando acesso diretamente a busca de "hoje+10" a "hoje+7" para 2 adultos e 1 criança
    Então devo ver uma mensagem clara de período inválido

  @negativo @bug @fail
  Cenário: CT05 - Rejeitar período com datas no passado (BUG-04)
    Quando acesso diretamente a busca de "hoje-10" a "hoje-7" para 2 adultos e 1 criança
    Então devo ver uma mensagem clara de período inválido
