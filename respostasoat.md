# Respostas: Implementação do MVP e Testes

## 1. Tela de Listagem
**1. Como ficou a estrutura do componente de card de filme? Ele foi feito para ser reutilizado?**
A gente resolveu deixar o componente `<MovieCard>` bem independente. Ele só precisa receber os dados do filme e a ação de clique via propriedades. Deixamos ele assim de propósito, bem limpo, focado só em mostrar a capa e o título. Assim, se no futuro a gente quiser criar uma tela de "Favoritos" ou de "Resultados de Busca", é só reaproveitar esse mesmo card sem precisar reescrever o código.

**2. De onde vêm os dados exibidos na lista?**
Em vez de fazer a requisição solta no meio da tela (o que vira uma bagunça rápida), a gente isolou isso. A tela inicial só importa e chama a função `getMovies()'.

**3. O que acontece na tela enquanto os dados estão sendo carregados?**
Enquanto a internet pensa e os dados não chegam, a gente exibe um *spinner* (o `ActivityIndicator`) no meio da tela com a mensagem "Carregando catálogo...", pro usuário não achar que o app travou ou fechou do nada.

---

## 2. Navegação e Tela de Detalhes
**4. Qual biblioteca de navegação foi usada e como os dados são passados?**
Fomos com o `@react-navigation/native-stack`. Na hora de ir pra tela de detalhes, a gente passa só o `id` do filme pela rota.

**5. A tela de detalhes busca os dados novamente ou reaproveita? Por quê?**
Ela faz uma nova busca na API usando o `id` que acabou de receber. A gente optou por fazer isso porque a primeira chamada (da lista) não traz as informações completas, como a sinopse inteira e os gêneros. Então, para ter uma tela de detalhes rica, a gente precisa fazer essa nova requisição lá dentro.

**6. É possível voltar sem perder o estado da lista?**
Sim, Como o Stack Navigator funciona literalmente como uma "pilha", a tela de detalhes é colocada por cima da lista. Quando o usuário clica em voltar, a tela inicial ainda tá lá, exatamente na mesma posição da rolagem que ele tinha deixado.

---

## 3. Tratamento de Estados (Loading e Erro)
**7. O que o usuário vê se a API demorar ou a requisição falhar?**
Se demorar, ele vê a nossa telinha de "Buscando informações...". Se der erro (seja um erro 400, o servidor cair com erro 500, ou o Wi-Fi dele desligar), a gente não deixa o app fechar na cara dele. Aparece uma mensagem clara avisando do problema.

**8. O grupo implementou forma de tentar novamente? Por que é importante?**
Sim, colocamos um botão "Tentar Novamente" usando nosso componente padronizado. Achamos isso essencial porque, em celular, é muito comum você entrar no elevador, o 4G sumir e voltar logo em seguida. Seria terrível o usuário ter que reiniciar o app inteiro só por causa de uma oscilação na rede.

---

## 4. Testes Manuais do MVP
**9. Em quais dispositivos o app foi testado e quais diferenças de layout foram observadas?**
Nós rodamos tanto no computador (emulador) quanto no nosso próprio celular usando o Expo Go. A principal diferença foi o tamanho da tela. Por sorte, como usamos Flexbox e configuramos as colunas com `flex: 1`, os cards se esticaram e se ajustaram super bem tanto em telas fininhas quanto nas maiores, sem amassar as capas dos filmes.

**10. Quais bugs ou comportamentos inesperados foram encontrados e corrigidos?**
Tivemos dois problemas bem chatos com a API da TVmaze na hora dos testes! Primeiro: alguns filmes não tinham foto de capa, o que quebrava o nosso layout. Resolvemos colocando uma imagem genérica (um placeholder) pra garantir. Segundo: a sinopse vinha cheia de tags de HTML misturadas no texto (tipo `<p>` e `<b>`). Tivemos que usar um filtro (uma regex) no código pra limpar esse texto antes de renderizar na tela.

**11. Por que testar em mais de um ambiente é importante no mobile híbrido?**
Porque no emulador do PC o layout quase sempre fica perfeito, mas na vida real o celular tem a câmera que corta um pedaço da tela (o notch), áreas seguras diferentes e teclado que sobe e esconde as coisas. Se a gente não testar no aparelho físico, a chance de mandar pro ar um app com botão que não dá pra clicar é gigante.

---

## 5. Teste Automatizado Simples
**12. Qual ferramenta foi usada e por quê?**
Nós usamos o `Jest` pros testes unitários e a `@testing-library/react-native` pros componentes. Escolhemos essas porque são a recomendação padrão da comunidade React e são muito práticas, não precisam abrir um emulador pesado no PC pra rodar e validar a lógica.

**13. O que exatamente o teste verifica e o que NÃO cobre?**
O nosso teste unitário verifica se a função utilitária `formatReleaseDate` sempre vai transformar uma data padrão americano pra "DD/MM/YYYY" direitinho. Já o teste de componente joga dados falsos (mock) no nosso Card pra garantir que o texto do título renderiza na tela. O que eles NÃO cobrem: não sabem se o clique físico na tela tá pegando bem e não testam se a internet ou a API caíram de verdade.

**14. Diferença entre teste automatizado e manual:**
O teste manual é testar a "vida real": ver se o visual tá legal, se o botão responde rápido e se a internet carrega. O automatizado é a nossa garantia de segurança no código: se amanhã a gente mexer em um arquivo e quebrar a função da data sem querer, o teste dá vermelho na hora e avisa a gente, antes desse erro ir parar na mão do usuário.

---

## 6. Documentação e Commit
**15. O que foi acrescentado ao README? É suficiente?**
Atualizamos o README documentando todo o comportamento do MVP, o fluxo das telas, o tratamento de erros que fizemos e detalhando a nossa estratégia de testes automatizados e manuais. Ficou super completo, qualquer colega que pegar nosso Github hoje vai entender a arquitetura só batendo o olho lá.

**16. O que esse commit representa? Já é um MVP utilizável?**
Sim, já dá pra chamar de MVP utilizável tranquilamente, porque ele cumpre a missão base prometida: você abre, tem uma lista de filmes real, consegue clicar, ler a sinopse limpa e voltar de boa, sem o app travar.

**17. Qual seria o próximo problema técnico/funcional a resolver?**
A coisa mais urgente tecnicamente seria colocar paginação (um Scroll Infinito). Do jeito que tá, a gente puxa a página 1 da API e morre ali. O usuário precisaria rolar a tela pra baixo e o app puxar a página 2, 3... Outra coisa legal seria salvar as fotos em cache para economizar o plano de dados móveis de quem estiver usando o app na rua.

