# language: pt
@navegacao
Funcionalidade: Acesso ao motor e integridade do fluxo
  Como hóspede
  Quero acessar o motor de reservas pelo link do hotel
  E não conseguir pular etapas obrigatórias

  @ambiente @bug @fail
  Cenário: CT15 - Link do hotel sem configuração não deve expor erro técnico (BUG-05)
    Quando acesso o motor de reservas com o identificador "1111"
    Então não devo ver a mensagem técnica "CONFIG ERROR"
    Mas devo ver uma mensagem amigável de hotel não encontrado

  @seguranca
  Cenário: CT16 - Acessar o checkout sem itens no carrinho redireciona para o início
    Quando acesso diretamente a etapa de checkout sem ter adicionado acomodação
    Então devo ser redirecionado para a página inicial do hotel
