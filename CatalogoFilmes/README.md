# Catálogo de Filmes

**Alunos:** Guilherme Brandão de Araújo e Julio Cesar Aragão

Aplicativo mobile desenvolvido em React Native (Expo) para listagem e consulta de detalhes de filmes. Este projeto tem como objetivo aplicar, na prática, o desenvolvimento focado em componentes, uso de bibliotecas externas, processos de build e testes automatizados.

## 1. Pesquisa de Bibliotecas

**Quais bibliotecas o grupo escolheu?**
Nós escolhemos o **React Navigation** (`@react-navigation/native` e `@react-navigation/native-stack`) para a navegação entre telas, o **Axios** para o consumo da API e o **Expo Vector Icons** para os ícones. Para os testes, adotamos o **Jest** e a **React Native Testing Library**.

**Por que escolhemos cada uma delas?**
O React Navigation é o padrão da comunidade, entregando transições nativas muito fluidas. Escolhemos o Axios no lugar do `fetch` nativo porque ele nos poupa tempo, convertendo respostas para JSON automaticamente e facilitando o tratamento de erros HTTP. O Expo Vector Icons já vem embutido no ecossistema do Expo, evitando configurações complexas.

**Uso do npx expo install:**
Sim, precisamos instalar as dependências base do React Navigation (`react-native-screens` e `react-native-safe-area-context`) utilizando o comando `npx expo install`. Isso garante que o Expo baixe a versão exata dessas bibliotecas que seja compatível com a versão do SDK do projeto, evitando conflitos nativos.

**Manutenção e documentação:**
Verificamos que essas bibliotecas são bem mantidas analisando seus repositórios no GitHub (milhares de estrelas e atualizações recentes) e lendo suas documentações oficiais, que são completas e têm ótima adoção pela comunidade.

**Limitações e pontos de atenção:**
No React Navigation, é má prática passar objetos pesados via parâmetro entre telas. Contornamos isso passando apenas o `id` do filme na rota e deixando a tela de detalhes buscar o resto.

## 2. Arquitetura do Projeto

**Telas e exibição:**
O app possui duas telas principais. A `HomeScreen` exibe a lista inicial de filmes (pôster e título). A `DetailsScreen` é aberta ao clicar em um item e mostra as informações detalhadas completas do filme escolhido (como sinopse, ano e nota).

**Fluxo de dados:**
Na `HomeScreen`, fazemos uma chamada à API para carregar a lista. Ao selecionar um filme, enviamos apenas o `id` para a `DetailsScreen`. Essa tela recebe o `id` e faz uma nova requisição à API para buscar os detalhes daquele filme específico.

**Separação em pastas:**
Separamos o código em `screens/`, `components/`, `services/` e `utils/` para manter o código limpo (Clean Code). Telas gerenciam visualização, componentes focam em reutilização, serviços lidam com comunicação externa e utils com formatação, facilitando muito a manutenção.

**Componentes reutilizáveis:**
Criamos o componente `<MovieCard />` para padronizar a exibição na lista e o `<StandardButton />` para garantir que todos os botões do aplicativo tenham a mesma identidade visual e de ação.

**Centralização da API:**
A lógica de comunicação está isolada em `services/api.js`. Isso é uma boa prática porque centraliza a URL base (TVmaze API) e o Timeout. Se a API mudar no futuro, alteramos apenas um arquivo.

## 3. Setup do Projeto

**Execução e conflitos:**
O projeto foi estruturado com sucesso. Tivemos que limpar conflitos do novo template do "Expo Router" (apagando a pasta app e arquivos residuais) para garantir que o React Navigation funcionasse de forma limpa e que o projeto rodasse perfeitamente no Expo Go via Tunnel.

## 4. Documentação

**Importância do registro inicial:**
Documentar as decisões desde o primeiro commit garante que toda a equipe entenda a arquitetura, mantendo um padrão de desenvolvimento consistente do início ao fim e evitando que regras de negócio se percam.

**Compreensão por terceiros:**
Sim, o README é autossuficiente. Qualquer desenvolvedor (ou o professor) que pegar este repositório entenderá de imediato quais ferramentas usamos, como os dados fluem e onde encontrar cada pedaço do código.

## 5. Primeiro Commit e Versionamento

**O que o primeiro commit representou:**
Ele representou a fundação estrutural do aplicativo, estabelecendo pastas e dependências antes de qualquer lógica visual ser implementada.

**Importância do versionamento antecipado:**
Começar o versionamento desde já (e não só quando estiver "pronto") nos dá um histórico seguro. Se o app quebrar durante o desenvolvimento, podemos usar o Git para voltar a uma versão estável. 

**Arquivos ignorados:**
Mantivemos a pasta `node_modules/` fora do versionamento via `.gitignore` por ser extremamente pesada e gerável localmente via `npm install`.

## 6. Comportamento do Aplicativo (MVP)

Conforme os requisitos da disciplina, o aplicativo foca em uma UI mínima e em navegação limpa, consumindo a **TVmaze API** de forma gratuita e aberta.

- **Responsividade e UI:** Utilizamos Flexbox no layout para garantir que a lista (FlatList) se adapte a diferentes tamanhos de tela perfeitamente.
- **Tratamento de Loading e Erros:** Enquanto as requisições ocorrem, um ActivityIndicator é exibido. Implementamos validação de status HTTP: erros na casa dos 400 avisam sobre falha de requisição, enquanto erros 500 informam instabilidade no servidor, sempre exibindo um botão customizado de "Tentar Novamente", sem fechar o app.

## 7. Testes Automatizados (Definition of Done)

Para atingir o "Definition of Done" do MVP, dividimos nossos testes em:
- **Teste Manual Exploratório:** O app foi testado simulando falha de rede para forçar os erros 400/500 visuais na tela.
- **Testes Unitários e Componentes:** Instalamos o `Jest` e a `@testing-library/react-native`. Na pasta `__tests__`, cobrimos a função utilitária `formatReleaseDate` (garantindo o formato DD/MM/YYYY) e renderizamos o `MovieCard` utilizando *mocks* para garantir a exibição correta do título do filme em interface isolada.
-