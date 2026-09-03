# Catálogo de Filmes

Alunos: Guilherme Brandão de Araújo e Julio Cesar Aragão

Aplicativo mobile desenvolvido em React Native (Expo) para listagem e consulta de detalhes de filmes. Este projeto tem como objetivo aplicar, na prática, o desenvolvimento focado em componentes, uso de bibliotecas externas e processos de build.

## 1. Pesquisa de Bibliotecas

Quais bibliotecas o grupo escolheu?
Para o nosso projeto, nós escolhemos o **React Navigation** (`@react-navigation/native` e `@react-navigation/native-stack`) para a navegação entre telas, o **Axios** para o consumo da API e o **Expo Vector Icons** para os ícones.

Por que escolhemos cada uma delas?
Nós optamos pelo React Navigation por ser o padrão da comunidade React Native, entregando transições nativas muito fluidas. Escolhemos o Axios no lugar do `fetch` nativo porque ele nos poupa tempo e código: ele converte as respostas para JSON automaticamente, trata erros HTTP de forma mais inteligente e facilita a configuração de uma URL base. Por fim, escolhemos o Expo Vector Icons porque ele já vem embutido no ecossistema do Expo, evitando a configuração complexa de vincular fontes manualmente no Android e iOS.

Uso do npx expo install:
Sim, nós precisamos instalar as dependências base do React Navigation (`react-native-screens` e `react-native-safe-area-context`) utilizando o comando `npx expo install`. Fizemos isso porque esse comando garante que o Expo baixe a versão exata dessas dependências nativas que é compatível com a versão atual do SDK do nosso projeto, evitando conflitos sistêmicos.

Manutenção e documentação das bibliotecas:
Nós verificamos que essas bibliotecas são bem mantidas analisando os repositórios oficiais no GitHub (que possuem milhares de estrelas e atualizações frequentes) e conferindo as documentações oficiais, que são completas, fáceis de ler e repletas de exemplos práticos.

Limitações e pontos de atenção:
O principal ponto de atenção que identificamos diz respeito ao React Navigation: é uma má prática passar objetos inteiros e pesados via parâmetro ao navegar de uma tela para outra. Para contornar essa limitação de performance, nossa estratégia será passar apenas o ID do filme na rota e deixar a tela de detalhes fazer o trabalho de buscar os dados completos.

## 2. Arquitetura do Projeto

Telas e exibição:
Nós definimos que o app terá duas telas principais. A `HomeScreen` exibirá a lista inicial de filmes (trazendo pôster e título). A `DetailsScreen` será aberta ao clicar em um item da lista e mostrará as informações detalhadas e completas do filme escolhido.

Fluxo de dados:
Os dados vão fluir de forma independente em cada tela. A `HomeScreen` fará uma chamada à API para carregar a lista. Ao selecionarmos um filme, enviaremos apenas o `id` dele para a `DetailsScreen`. Essa tela receberá o `id` e fará uma nova requisição à API para buscar os detalhes específicos apenas daquele filme.

Separação em pastas:
Nós decidimos separar o código em `screens/`, `components/` e `services/` em vez de deixar tudo no arquivo principal para manter o código limpo (Clean Code). Isso divide as responsabilidades: as telas gerenciam a visualização macro, os componentes gerenciam a reutilização visual, e os serviços lidam com o mundo externo, facilitando a manutenção e evitando arquivos gigantes.

Componentes reutilizáveis:
Já conseguimos identificar que precisaremos construir um componente `<MovieCard />` para padronizar a exibição de cada filme na lista, e possivelmente um componente `<Loading />` para dar feedback visual enquanto aguardamos a resposta da API.

Centralização da API:
Toda a lógica de comunicação externa ficará centralizada na pasta `services/`, dentro do arquivo `api.js`. Consideramos isso uma excelente prática porque, caso a URL do servidor mude ou precisemos adicionar autenticação futuramente, faremos a alteração em um único arquivo, e todo o app já estará atualizado.

## 3. Setup do Projeto

Execução e conflitos:
O projeto rodou sem erros após a instalação inicial das ferramentas. Nós evitamos proativamente problemas de conflito de versão com o SDK do Expo pois instalamos as bibliotecas de dependência nativa com o comando correto do Expo, delegando a ele a responsabilidade de gerenciar as compatibilidades.

## 4. Documentação

Importância do registro inicial:
Nós consideramos fundamental documentar as decisões do projeto desde o primeiro commit para garantir que nós dois estejamos na mesma página sobre a organização do código e as ferramentas escolhidas, mantendo um padrão de desenvolvimento consistente do início ao fim.

Compreensão por terceiros:
Se outra pessoa (ou o nosso professor) entrasse no projeto agora, este README seria totalmente suficiente para ela entender o que foi decidido. O documento está claro, explica o motivo por trás de cada escolha técnica e detalha onde encontrar cada parte da lógica do nosso aplicativo.

## 5. Primeiro Commit

O que este commit representa:
Ele representa a fundação do nosso aplicativo. É o marco inicial onde a estrutura base (pastas, configurações e documentação) foi estabelecida de forma organizada, servindo de alicerce limpo antes de começarmos a codificar a interface e a lógica pesada.

Importância do versionamento antecipado:
É essencial começar o versionamento agora, e não no final, porque o Git nos dá um histórico seguro de tudo o que fazemos. Se errarmos algo no futuro ou o app quebrar, podemos voltar a este ponto funcional. Deixar para versionar só quando estiver pronto tira o propósito da ferramenta, que é acompanhar a evolução gradual e permitir o trabalho em equipe sem o risco de sobrescrevermos o código um do outro.

Arquivos ignorados no versionamento:
Nós decidimos manter a pasta `node_modules/` fora do controle de versão (ela já vem listada no arquivo `.gitignore` padrão do Expo). Fizemos isso porque ela é extremamente pesada, contém milhares de arquivos de terceiros e pode ser facilmente recriada por qualquer pessoa rodando o comando `npm install`. 