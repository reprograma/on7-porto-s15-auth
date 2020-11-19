# on6-xp-s15-jwt

## Subindo sua aplicação para o Heroku

### Configuração do Mongo Atlas

1. Crie uma conta no Mongo Atlas: https://www.mongodb.com/cloud/atlas/register

2. Escolha um nome para o seu projeto, selecione qualquer linguagem com a qual você trabalha mais e clique em _Continue_.

3. Selecione o plano _Shared Clusters_, que é gratuito, e clique em _Create a cluster_.

4. Na página seguinte você verá algumas configurações sobre o cluster. A única modificação que faremos é em _Cluster Name_. Dê um nome para seu cluster e depois clique em _Create Cluster_.

5. Depois disso, seu cluster será criado e você pode fazer algumas configurações enquanto isso acontece. Aparecerá uma lista de passos pra você seguir, clique em _Create your first database user_. Siga as instruções e guarde seu login e senha, pois será usado em configurações posteriores.

6. No próximo passo, _Whitelist your IP address_, precisamos ficar quais IPs poderão fazer requisições para esse cluster. Por hora, vamos habilitar todos. Para isso basta clicar em _Add IP Address_ e selecionar o botão escrito _ALLOW_ACCESS_FROM_ANYWHERE_. Por fim, clique em _Confirm_.

7. Quando seu cluster terminar de ser criado, é só clicar no último passo, _Connect your cluster_. Ali você verá um botão _CONNECT_ e ao clicar, selecione _CONNECT_YOUR_APPLICATION_. Aqui você terá acesso a sua string de conexão, mas vai precisar substituir _<password>_ e _<dbname>_ pela senha e nome do banco que você deu anteriormente. Guarde essa string de conexão, pois iremos utilizá-la em breve.

### Configuração do Heroku

1. Instalar o Heroku CLI, conforme seu sistema operacional: https://devcenter.heroku.com/articles/heroku-cli

2. Criar uma conta no site do Heroku: http://heroku.com/

3. É necessário especificar qual versão do Node você está usando para rodar seu projeto. De preferência, use a versão local:
```
$ node -v
// v14.5.0
```

4. Depois, configure no seu `package.json` a versão:

```
"engines": {
  "node": "v14.5.0" // substituir pela sua versão local, que é o retorno do comando acima
}
```

5. Precisamos indicar para o Heroku como inicializar nossa aplicação. Para isso, é possível criar um arquivo chamado `Procfile` (sem nenhuma extensão mesmo), do qual o Heroku irá reconhecer e ler os comandos ali dentro. Crie seu arquivo `Procfile` na raiz do seu projeto e dentro ele, insira:

```
web: npm install && node server.js
```

6. Quando subimos nossa aplicação, indicamos uma porta para estabelecer a comunicação. Como sempre subimos local, o padrão é `8080`, como é possível ver no arquivo `server.js`. Mas quando subimos no Heroku, nem sempre a porta será essa. Será responsabilidade do Heroku alocar uma porta para nossa aplicação e não temos como saber qual será. Para isso, o Heroku seta o valor da porta em uma variável de ambiente chamada `PORT`. Isso quer dizer que, sempre que precisarmos saber em qual porta subir nossa aplicação, só precisamos usar a variável `PORT`. Para isso, crie essa variável com um valor padrão em seu `.env`:

```
PORT=8080
```

7. Depois, substitua a sua porta `8080` do seu `server.js` por ela:

```
const app = require("./src/app");
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app está rodando na porta ${port}`);
});
```

8. Voltando para o Heroku, agora vamos criar nosso app. Acesse o link e configure um nome para sua app: https://dashboard.heroku.com/new-app

9. Após criar, agora vamos configurar o ambiente do Heroku na nossa máquina, para que a gente possa fazer deploy da nossa aplicação. Faça login no Heroku utilizando seu email e senha utilizadas previamente no cadastro:

```
$ heroku login
```

10. Acesse a pasta onde está sua aplicação e adiciona o remote do Heroku ao seu projeto:

```
$ cd caminho-da-sua-app
$ heroku git:remote -a nome-da-app-que-você-deu-no-heroku
```

11. Agora, precisamos configurar sua chave RSA, necessária para autenticar na sua aplicação. Ela já está em uma variável de ambiente, então só precisamos criar uma nova. **Lembre-se: não podemos usar a mesma chave RSA que subimos para o git, ou qualquer pessoa poderá acessá-la para gerar tokens de autenticação da sua aplicação.** Gere sua chave localmente ou pelo site: https://travistidwell.com/jsencrypt/demo/.

12. Insira a chave _privada_ em uma variável de ambiente chamada SECRET (precisa ter o mesmo nome que usamos na aplicação) no Heroku:
```
heroku config:set SECRET=SUA_CHAVE_RSA_PRIVADA_SEM_ASPAS
```

13. A última configuração necessária agora é configurar a variável de ambiente que contém a URI do nosso banco de dados. Criamos anteriormente um cluster no Mongo Atlas, que nos deu uma string de conexão. É ela que vamos usar para setar a variável de ambiente. Quando subirmos a aplicação local, a aplicação usará o valor dessa variável que está no arquivo `.env`. Quando estiver no Heroku, usará a variável configurada lá:

```
heroku config:set MONGODB_URL=SUA_STRING_DE_CONEXÃO_DO_MONGO_ATLAS
```

14. Por fim, tudo o que precisamos agora é subir os arquivos do nosso projeto para o Heroku:

```
git push heroku master
```

15. Você irá encontrar seu site em: https://NOME-DA-SUA-APP.herokuapp.com
