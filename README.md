# NLW Expert em NodeJS da Rockeseat 

#### Abaixo estarão alguns comandos essenciais, e o passo a passo para ter êxito ao rodar o código e todas as suas respectivas funcionalidades.

> Para ***iniciar o projeto***, precisamos utilizar o powershell (pode ser do próprio VScode):

- 'npm init -y': Este comando inicia um novo projeto Node.js e cria um arquivo package.json com as configurações padrão, aceitando automaticamente as opções padrão.

- 'npm install typescript @types/node -D': Instala o TypeScript e as definições de tipo para o Node.js como dependências de desenvolvimento (-D) no projeto.

- 'npx tsc --init': Inicializa o arquivo de configuração do TypeScript (tsconfig.json) no diretório do projeto.

- 'npm install tsx -D': Parece haver um erro neste comando, pois tsx não parece ser um pacote npm. Talvez você quis dizer npm install react-ts ou algo semelhante.

- 'npm i fastify': Instala o framework Fastify no projeto.

- 'npm install -D prisma': Instala o Prisma como uma dependência de desenvolvimento no projeto.

- 'npm install zod': Instala a biblioteca Zod para validação de dados.

- 'npx prisma init': Inicializa o projeto Prisma no diretório, criando os arquivos necessários para a configuração do banco de dados.

- 'npm i @fastify/cookie': Instala o plugin Fastify Cookie para manipulação de cookies.

- 'npx prisma migrate dev': Executa as migrações do Prisma no banco de dados, aplicando as alterações no esquema.

- 'npm i ioredis': Instala a biblioteca Ioredis para interação com o Redis.

- 'npm i @fastify/websocket': Instala o plugin Fastify WebSocket para adicionar suporte a WebSocket ao projeto.

- 'docker logs 'id'': Exibe os logs do contêiner Docker com o ID especificado.

- 'npm run dev': Executa o script definido como "dev" no arquivo package.json, geralmente usado para iniciar o servidor de desenvolvimento.

- 'npx prisma studio': Inicia o Prisma Studio, uma interface gráfica para explorar e gerenciar os dados do banco de dados.

- 'docker-compose up -d': Inicia os serviços definidos no arquivo Docker Compose em modo "detached" (em segundo plano).

- 'docker ps': Lista os contêineres Docker em execução no sistema.

> No meu caso, eu utilizei uma ***docker***, para a aprendizagem do projeto, e para isso, basta seguir os seguintes passos:

>> A forma mais fácil e recomendada de obter o Docker é instalar o Docker Desktop. O Docker Desktop inclui o Docker Compose juntamente com o Docker Engine e Docker CLI, que são pré-requisitos do Compose.

>> O Docker Desktop está disponível em: [link](https://docs.docker.com/desktop/install/windows-install/)

1. Verifique se o seu sistema está com a virtualização ativada: [link](https://docs.docker.com/desktop/troubleshoot/topics/#virtualization)
2. Faça o download do instalador na página: [link](https://docs.docker.com/desktop/install/windows-install/)
3. Duplo clique em Docker Desktop Installer.exe para executar o instalador.
4. Quando solicitado, certifique-se de que a opção "Use o WSL 2 em vez do Hyper-V" na página de Configuração está selecionada ou não, dependendo da sua escolha de backend.
5. Se o seu sistema suportar apenas uma das duas opções, você não poderá selecionar qual backend usar.
6. Siga as instruções no assistente de instalação para autorizar o instalador e prosseguir com a instalação.
7. Quando a instalação for bem-sucedida, selecione Fechar para completar o processo de instalação.
8. Busque por Docker e selecione Docker Desktop nos resultados da busca, e pronto.

> Se preferir outro método ao invés do Docker, foi mostrado no curso a seguinte solução, de como trocar do PostgreSQL para o SQLite (banco em arquivo) e utilizar um serviço online para o Redis. 

### Configurando o SQLite

1. Se tiver a pasta `prisma/migrations`, apague ela. (está tudo bem se não tiver)
2. No arquivo `prisma/schema` , troque o valor de `provider` para `sqlite`
    `datasource db {
    provider = "sqlite" // Essa linha
    url      = env("DATABASE_URL")
    }`

3. No arquivo `.env` troque a URL de conexão para um novo caminho:

`DATABASE_URL="file:./app.db"`

**Recomendamos colocar no .gitignore esses valores:**
> *.db
> *.db-journal

4. Executar o comando `npx prisma migrate dev` para criar as migrations. Informe o nome que preferir.
5. Por fim, no arquivo `src/http/routes/create-poll.ts`, não é possível utilizar o `createMany` com o SQLite, vamos então trocar para:

`// ...
// Primeiro, criar a poll, sem options.
const poll = await prisma.poll.create({
  data: {
    title,
  }
})

// Em seguida, utilizar um Promise.all para criar todas as options:
await Promise.all(options.map((option) => {
  return prisma.pollOption.create({
    data: {
      title: option,
      pollId: poll.id
    }
  })
}))`

### Configurando o Upstash + Redis
*Antes de tudo, o que é o Upstash? Upstash é uma plataforma com diversos serviços para ambiente serverless (outro tipo de aplicação que não precisa se preocupar agora, foco jovem gafanhoto), e um desses serviços é um Banco Redis. O plano free é bem generoso.*

1. Crie uma conta no site: [Upstash: Serverless Data Platform](https://upstash.com/)
2. No menu ao topo da página, selecione `Redis` e clique em “Create Database”.
3. Um modal deverá ser aberto e é preciso preechê-lo com as seguintes opções: 

*Coloque o nome de sua preferência, mantenha a opção `Regional` selecionada e no select abaixo escolha `us-east-1`.*
*Não precisa marcar nenhuma das outras opções. Clique em `Create`.*

*Ao criar sua Database, acesse ela e terá uma página parecida com essa:*

[](bcffb95ba92461382b864aec819abf913f8846d3b48c344b2b7f9ff04a96c46e_copy.jpg)
*Clique no botão informado e copie toda a URL de conexão.*

4. De volta ao seu projeto, no arquivo .env, crie uma nova variável com o nome REDIS_URL 
> `DATABASE_URL="file:./app.db"`
> `REDIS_URL="URL_AQUI"`

5. Por fim, no arquivo `src/lib/redis.ts`, vamos configurar para utilizar essa variável:

>import { Redis } from "ioredis";
>
>if (!process.env.REDIS_URL) {
>  throw new Error("Missing REDIS_URL env var");
>}
>
>export const redis = new Redis(process.env.REDIS_URL)

[Caso haja dúvida, só seguir o link para o repositório oficial do projeto:](https://github.com/rocketseat-education/nlw-expert-nodejs/tree/0f1a0f1e8343963ff72b523c5105de3d375e2b7f)

#### Lembrando que todos as informações acima foram retiradas do material complementar oficial do curso, e colocados aqui não para fins de divulgação do trabalho de outra pessoa, mas sim os passos que utilizei e achei relevante de serem citados em caso pessoal de replicação deste projeto e seus fundamentos. Todos os direitos do tutorial acima pertencem à ***Rocketseat***. 

### LINKS DE DOCUMENTAÇÃO DE CADA TECNOLOGIA:

### [Redis](https://redis.io/)
### [PostgreeSQL](https://www.postgresql.org/)
### [NodeJS](https://nodejs.org/en)
### [TypeScript](https://www.typescriptlang.org/)
### [Fastify](https://fastify.dev/)
### [Prisma](https://www.prisma.io/)
### [Zod](https://zod.dev/)
### [Docker](https://www.docker.com/)
### [Ioredis](https://www.https://www.npmjs.com/package/ioredis.com/)
### [Hoppscotch](https://hoppscotch.io/)