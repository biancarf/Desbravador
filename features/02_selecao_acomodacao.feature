# language: pt
@acomodacao
Funcionalidade: Seleção de acomodação e composição de hóspedes
  Como hóspede
  Quero escolher uma acomodação e informar quantas pessoas vão se hospedar
  Para montar a reserva com o preço correto

  # Por que esta funcionalidade é crítica:
  # é onde o preço é apresentado e onde a regra de ocupação é aplicada.
  # Preço errado = risco financeiro e jurídico (CDC, oferta vincula o fornecedor).
  # Ocupação errada = overbooking de pessoas no quarto ou bloqueio de vendas válidas.

  Contexto:
    Dado que consultei a disponibilidade de "hoje+7" a "hoje+10" para 2 adultos e 1 criança

  @critico @bug @fail
  Cenário: CT06 - Exibir preço válido em todas as acomodações ofertadas (BUG-02)
    Então todas as acomodações listadas devem exibir um preço em reais no formato "R$ 0,00"
    E nenhum preço deve conter "NaN" ou "undefined"

  @critico @bug @fail
  Cenário: CT07 - Permitir escolher a quantidade de adultos na acomodação (BUG-01)
    Então o seletor de adultos de cada acomodação deve oferecer ao menos 1 opção

  @critico @bug @fail
  Cenário: CT08 - Adicionar uma acomodação ao carrinho (BUG-01)
    Quando adiciono a primeira acomodação disponível com 2 adultos
    Então o resumo da reserva não deve estar vazio

  @regra-de-negocio @dados
  Cenário: CT09 - Quarto STANDARD ST1 deve respeitar a ocupação máxima
    # Cadastro do ST1 retornado pela API: ocupação máxima 2, sem aceitar criança de 3-12 anos.
    # O enunciado pede 2 adultos + 1 criança no ST1 (3 pessoas): o comportamento
    # CORRETO do sistema é NÃO permitir essa composição nesse quarto.
    Então a acomodação "ST1" não deve ser ofertada para 2 adultos e 1 criança
