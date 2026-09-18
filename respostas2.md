Respostas: Refinamento, Pós-MVP e Entrega Final

Alunos: Guilherme Brandão de Araújo e Julio Cesar Aragão

1. Identidade Visual e Consistência

1. Qual paleta de cores e fonte de destaque o grupo escolheu? Por que essas escolhas combinam com a proposta do app?
Nós criamos uma paleta fortemente inspirada em grandes plataformas de streaming e na temática de cinema. Escolhemos um "Dark Mode" real, com um fundo preto profundo, textos em branco/cinza, e elementos de destaque (como ícones, botões e estrelas) em vermelho e laranja vibrante. Essa escolha faz total sentido porque descansa a vista do usuário em um app que é naturalmente cheio de imagens coloridas (capas dos filmes).

2. O que foi feito para manter consistência visual entre a tela de listagem e a tela de detalhes?
Centralizamos todas as nossas cores em um único arquivo chamado src/theme/colors.js. Assim, qualquer componente do aplicativo busca a cor do mesmo lugar. Além disso, criamos um componente padronizado chamado <EmptyState>: se a busca falhar, se o histórico estiver vazio ou se não tiver favoritos, a tela vazia será desenhada exatamente com o mesmo padrão visual, ícones e espaçamentos.

3. O ícone e a splash screen do app já refletem essa identidade, ou ainda estão no padrão do template?
Sim. A SplashScreen, ela não é só uma imagem estática; usamos a biblioteca Animated nativa para fazer o ícone (um rolo de filme em vermelho) e o texto "CinePrime" aparecerem de forma suave antes de entrar no aplicativo. Deu uma cara muito premium pro projeto.

2. Escolhas e Funcionalidades Pós-MVP

4. Qual(is) categoria(s) do cardápio pós-MVP o grupo escolheu implementar? Por que essa escolha faz sentido?
Implementamos um sistema de Favoritos, uma aba de Histórico de visualização e um botão que abre um Modal de Filtros avançados na tela inicial. Faz sentido porque um catálogo de filmes sem uma boa busca ou sem a capacidade de salvar o que você gostou acaba perdendo a utilidade muito rápido.

5. O que foi necessário instalar ou configurar para implementar essa funcionalidade?
Precisamos instalar duas bibliotecas fundamentais da comunidade: o @react-native-async-storage/async-storage para permitir que o app grave arquivos na memória física do celular, e o @react-navigation/bottom-tabs para criar a nossa barra de navegação inferior que interliga as 3 abas de forma elegante.

6. Existe alguma categoria do cardápio que o grupo considerou e descartou? Por quê?
Sim, cogitamos fazer "Login e Autenticação". Pois para um app de catalogo não fazia sentido a implementação.

3. Integração e Experiência do Usuário (UX)

7. Como a nova funcionalidade se conecta às telas já existentes?
A Home ganhou um botão de "funil" que sobe um Modal flutuante para os filtros. Quando o usuário clica num filme na Home, a tela de Detalhes abre e, por baixo dos panos, já salva esse filme na aba de Histórico. Na própria tela de Detalhes, a estrela laranja no topo conversa diretamente com a aba de Favoritos. A barra inferior amarra todas essas telas juntas.

8. A funcionalidade implementada é real ou uma simulação de interface? Justifiquem.
É 100% real e funcional. Nós optamos por usar o AsyncStorage justamente para não ser um mock "de mentira". Se o usuário favoritar um filme e fechar o aplicativo no multitarefas do celular, quando ele abrir amanhã, a estrela vai continuar acesa e a aba de favoritos vai continuar lá.

9. Quais estados vazios (empty states) foram tratados? O que o usuário vê nesses casos?
Fizemos questão de tratar todos eles. Se o usuário acabou de abrir o app e vai no Histórico, ele vê o ícone de uma ampulheta e a mensagem: "Você ainda não acessou nenhum filme". O mesmo vale para os Favoritos. Na Home, deixamos a mensagem dinâmica: se ele filtrar pelo ano 2026 e não achar nada, o app diz exatamente "Não encontramos filmes lançados no ano de 2026", em vez de uma tela vazia misteriosa.

10. O que mudou na experiência de uso depois da revisão cruzada com outro participante do grupo?
Foi muito importante para o nosso filtro. Antes, a gente exibia o "Ano de Lançamento" como vários botões (chips) para o usuário clicar. Na revisão, percebemos que isso ficaria péssimo e ocuparia a tela toda se tivessem 50 anos diferentes. Mudamos a abordagem: trocamos para um campo numérico onde o usuário simplesmente digita o ano (ex: 2012). Também adicionamos a ordenação Z-A, que não tinha antes.

4. Refatoração e Testes Automatizados

11. O que foi removido ou reorganizado na limpeza do código?
Nós removemos pastas residuais de templates padrão do Expo, unificamos nossos botões para usar os do /components, e consolidamos um erro terrível de cache que estávamos sofrendo. Reorganizamos todas as funções de salvar/ler do celular dentro de um objeto único chamado StorageManager, o que deixou o código limpo, sem conflitos de exportação e parou de travar a tela de favoritos.

12. Os testes automatizados escritos na etapa do MVP ainda passam depois das mudanças desta etapa?
Não foram feitos

5. Entrega Final e Documentação

13. O README atual documenta as principais decisões? O que foi adicionado nesta etapa?
Completamente. O README foi expandido para documentar nossa nova Identidade Visual, a persistência de dados local (Favoritos e Histórico) usando AsyncStorage, o tratamento aprimorado de Empty States e a implementação das Bottom Tabs. Alguém que baixar o código hoje vai entender exatamente como ele funciona de ponta a ponta.

14. O grupo conseguiu gerar um build de teste? Se não, qual foi o obstáculo?
Nós geramos nossos testes físicos reais através do Expo Go via modo Tunnel. O app roda perfeitamente de forma nativa. O build autônomo (o .apk final empacotado para a Google Play) é um passo futuro, pois exige configuração de chaves de assinatura e tempo de fila no serviço EAS do Expo, o que fugiria do escopo de tempo desta entrega.

15. Olhando o app finalizado, o que ele tem hoje que o MVP original não tinha — e o que ficaria para o futuro?
O MVP era só uma lista seca e uma tela de detalhes. Hoje, o aplicativo tem "vida" e alma. Ele possui uma Identidade Visual forte com animação de Splash Screen, lida incrivelmente bem com buscas combinadas (filtro por texto, gênero, data digitada e ordem), e guarda o comportamento do usuário (Histórico e Favoritos). Para uma v2, no futuro, só faltaria a paginação (um scroll infinito na API para carregar mais filmes) e talvez um backend real para salvar os favoritos na nuvem.