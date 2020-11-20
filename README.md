# Autenticação e autorização na API com Node.js

## Exercício feito no repositório

O objetivo do exercício da semana é uma API de tarefas a se fazer. *Só usuárias que possuem um token válido* podem visualizar as tarefas que foram criadas. Este passo-a-passo foi feito baseado no repositório de Anna (inserir o link da conta)

### Este é o passo-a-passo resumido da atividade do sábado

1. Criar, do jeito que sempre fazemos, pelo menos uma tarefa para testar no final de tudo;

2. Criar colaboradoras; 

3. Proteger a senha da colaboradora BCRYPT!;

4. Visualizar todas as colaboradoras cadastradas (para facilitar seu trabalho no passo 5);

5. Criar um token para cada colaboradora - login;
   	- Preparando o ambiente e pacotes - json web token, chave secret , dotenv-safe;
   	- Finalmente manipulando as colaboradoras;
6. Criar um método - baseado no token criado no passo 5 - para visualizar a tarefa. É a rota autenticada;

7. Testar no Postman se o token deu certo e a tarefa aparece.

### Este é o passo-a-passo detalhado da atividade

**1. Criar, do jeito que sempre fazemos, pelo menos uma tarefa para testar no final de tudo:**

- Faça o método POST (postTarefa) no `tarefasController.js`.

**2. Criar colaboradoras;**

- Faça o método POST (postColaboradora) no `colaboradorasController.js`. Cada colaboradora deverá receber um nome, um e-mail e uma senha;

**3. Proteger a senha da colaboradora;**

A senha que a colaboradora não pode ficar exposta no banco de dados. Para isso, **vamos usar a primeira novidade, o *bcrypt***. Ele vai traduzir uma senha, como _cachorrocarlos123_ por exemplo, para uma sequência enorme de números e letras:

- Instale o bcrypt -> `$ npm install bcrypt`

- Adicione o bcrypt (fazer require) no `colaboradorasController.js` -> `$ const bcrypt = require('bcrypt');`

- Gere a senha criptografada (hash) com senha da colaboradora que foi recebida no body do Postman -> `$ bcrypt.hashSync(request.body.senha, 10);`

- Pronto! Agora seu banco de dados tem a colaboradora com nome, e-mail e **senha segura**. Pode deixar essa senha lá, não vamos usá-la por enquanto. 

> ⚠️ Atenção: esta senha criptografada NÃO É O SEU TOKEN. Esta senha criptografada é apenas uma proteção para as usuárias da API.

**4. Visualizar todas as colaboradoras cadastradas (para facilitar seu trabalho no passo 5);**

- Faça o método GET no colaboradorasController (colaboradoras ou o nome que você preferir)

**5. Criar um token para cada colaboradora;**

Aqui começaremos a usar a **segunda novidade: o JWT, ou Json Web Token**. O que ele faz?  O JWT cria uma sequência enorme de números, letras e pontos, com a ajuda de uma sequência maior ainda, a chave SECRET, que vamos tirar de um site. 

> Observações importantíssimas, NÃO DEIXE DE LER:
>
> O JWT nunca vai conseguir gerar o token certo sem a chave SECRET. 
>
> A chave SECRET que você tirou do site precisa ficar salva num arquivo separado no projeto, chamado .env. 
>
> O arquivo env vai "segurar" esta chave em segurança, mas permite que ela seja lida em QUALQUER LUGAR do projeto. 
>
> Precisaremos de uma terceira novidade para criar este arquivo .env direito, o pacote `dotenv-safe`.
>
> O token, depois de pronto, vai ser adicionado lá no Postman na aba Headers, após a palavra 'Authorization'.

Vamos para o passo a passo disso tudo!

Preparando o ambiente:

- Instale "jsonwebtoken" via npm install -> `$ npm install jsonwebtoken`
- Instale o pacote `dotenv-safe`, que vai ajudar a guardar sua chave SECRET -> `$ npm install dotenv-safe`

-  Acesse o site https://travistidwell.com/jsencrypt/demo/ e gere uma chave pública e uma chave privada. Copie as duas em um bloco de notas;

- Crie um arquivo .env.example e .env na raiz do projeto;
- Cole nos dois arquivos acima a **chave privada** que você tinha copiado lá no seu bloco de notas, desse jeito -> `$ SECRET=chave_rsa_aqui_sem_aspas`
- Avise para a aplicação toda, no `app.js`, que tem uma chave SECRET guardada no .env para ela trabalhar em qualquer arquivo -> `$ require('dotenv-safe').config();`

obs.: a chave pública que ainda está no seu bloco de notas serve para alguma coisa. Só não sei pra quê. rs

Finalmente manipulando o arquivo de colaboradoras:

- Fazer require do plugin JWT no `colaboradorasController.js` -> `$ const jwt = require('jsonwebtoken');`
- Importar a chave SECRET no `colaboradorasController.js` -> `const SECRET = process.env.SECRET`

- Crie um método POST chamado login em `colaboradorasController.js` . É ele quem vai pegar sua chave privada (SECRET) e as funcionalidades do JWT para CRIAR um token válido. Este método precisa:

  - Buscar a colaboradora a partir do email recebido no Postman, e mostrar um erro 404 caso não encontre -> `$ Colaboradoras.findOne({ email: req.body.email }, function(error, colaboradora) {...}`

  - Comparar a senha de colaboradora já registrada no sistema com a senha recebida via Postman, e mostrar um erro 401 caso seja diferente -> `$ bcrypt.compareSync(request.body.senha, colaboradoraEncontrada.senha);`

  - Se for igual, gerar token JWT baseado no SECRET -> `$ jwt.sign({ name: colaboradora.name }, SECRET);`

- Agora você tem um token e está liberada para visualizar as tarefas!

**6. Criar um método - baseado no token criado no passo 5 - para visualizar a tarefa.**

- Faça require do plugin JWT no `tarefasController.js` -> `$ const jwt = require('jsonwebtoken');`
- Importe a chave SECRET no `tarefasController.js` -> `const SECRET = process.env.SECRET`
- Criar método GET para visualizar as tarefas:
  - Crie a variável que vai importar o token que será digitado lá no Postman (no header 'authorization') -> `const authHeader = req.get('authorization');`

- Criar o IF para o caso da usuária nem digitar o token; 
- Verificar com o jwt se o token está certo e enviar a resposta para cada caso.

**7. Testar no Postman se o token deu certo e a tarefa aparece**

E aí, será que deu tudo certo?? Vamos ver!

- Abra o Postman e a rota login. Deixe ela aberta, o token aparecerá na resposta;
- Abra uma nova aba e execute o GET Tarefas;
- Em Headers, digite "Authorization" em keys e "Bearer <o_token_que_apareceu_na_aba_anterior>" em value.
- Reforça na oração e espera a magia acontecer!

 

__________________





autenticacao: quem é vc

autorizacao: o que vcpode fazer??

## Por que se preocupar com autenticação

Quando fazemos uma API Rest, adicionamos linhas de código - nos arquivos `controller` - para ver registros, adicionar, excluir, editar e tudo mais. São os métodos como GET, PUT e DELETE que exibem ou alteram qualquer coisa que está no banco de dados, certo?

Mas será que é prudente deixar todas essas funções expostas para qualquer pessoa fazer e mexer no banco de dados? Não, né?

➡️ Por exemplo: suponha que você está desenvolvendo uma API de uma galeria de arte, incluindo os quadros e os colaboradores da loja. Essa seria uma boa lista de permissões:

| Tarefa                                                       | Método | Para quem é permitido? | Em que controller este método estará? |
| ------------------------------------------------------------ | ------ | ---------------------- | ------------------------------------- |
| Visualizar todos os quadros a venda.                         | GET    | Todos.                 | quadrosController                     |
| Visualizar o desconto máximo que pode ser dado a um cliente. | GET    | Vendedores da loja.    | quadrosController                     |
| Adicionar 10 quadros que chegaram do novo fornecedor.        | POST   | Gerente de vendas.     | quadrosController                     |
| Editar um funcionário.                                       | PUT    | Gerente de RH.         | colaboradoresController               |
| Excluir um colaborador que foi desligado.                    | DELETE | Gerente de RH.         | colaboradoresController               |
| Visualizar a lista de salários de todos os colaboradores, incluindo a proprietária. | GET    | Proprietária da loja.  | colaboradoresController               |

Em resumo, é isso o que será feito neste repositório: gerenciar permissões, seguindo estes passos:

- 
- 
- 
- 

Mas, para fazer direito, vamos começar do começo...

## Criptografia, Hash e Tokens

### Hash



Hash: É o dígito verificador gerado por um algoritmo. Alguns algoritmos são: febraban, MD5, SHA1, SHA-256, SHA-512, bcrypt. Uma função hash é um algoritmo que mapeia dados de comprimento variável para dados de comprimento fixo. Os valores retornados por uma função hash são chamados valores hash, códigos hash, somas hash, checksums ou simplesmente hashes.

Não dá pra converter o hash de volta, o que é diferente de criptografia...

### Criptografia

Aqui a gente nâo perde dados

tipos de algoritmos de criptografia

RSA (mais comum), AES, RC4, Blowfish, curvas elipticas, YAK

#### Criptografia simétrica

#### Criptografia assimétrica

### Token

É um padrão RFC (RFC-7519) que define como transmitir e armazenar objetos JSON de forma segura. Json Web Token.

É formado por 

Header (como o token foi criado  { "alg": "HS256", "typ": "JWT"}, 

Payload (onde passamos qualquer informaçao) {"name": "mariana", "email": "mariana@gmail.com", "senha": "mariana1234"} e 

Signature (qual agoritmo foi usado para gerar o token?), é o SECRET que montou o token!

Aqui geraremos apenas um token.



### Exercício

Converta seu nome 





## on6-xp-s15-jwt

## Autenticação

### Criar rota autenticada

1. Instalar "jsonwebtoken" via npm install
   `$ npm install jsonwebtoken`

2. Gerar chave pelo https://travistidwell.com/jsencrypt/demo/ e guardar a chave pública

3. Instalar dotenv-safe
   `$ npm install dotenv-safe`

4. Criar arquivo .env.example e .env, ambos com chave chamada SECRET
   `$ SECRET=chave_rsa_aqui_sem_aspas`

5. Carregar as variáveis de ambiente no projeto, no arquivo tarefasRoute.js
   `$ require('dotenv-safe').config();`

6. Criar variável contendo a SECRET
   `$ const secret = process.env.SECRET`

7. Criar método de autenticação em `getAll`

8. Pegar o header de autorização e enviar uma mensagem de erro 401 quando vir vazio
   `$ const authHeader = request.get('authorization');`

9. Passar bearer token no header de autenticação via Postman
   `$ Bearer TOKEN_JWT_AQUI`

10. Verificar token JWT e enviar uma mensagem de erro 403 caso seja inválido
    `$ jwt.verify(token, SECRET, (error) => {...});`

### Criar rota para criar colaboradoras

1. Criar rota para criar usuária em colaboradorasRoute.js
   `$ router.post('/', controller.create);`

2. Criar model de colaboradoras com id, nome, email e senha

3. Criar método no controller para criar colaboradora

4. Criar uma colaborada de teste via Postman

### Criptografar senha das colaboradoras

1. Instalar bcrypt
   `$ npm install bcrypt`

2. Fazer require do bcrypt no `colaboradorasController.js`
   `$ const bcrypt = require('bcrypt');`

3. Gerar hash com senha recebida no body da request
   `$ bcrypt.hashSync(request.body.senha, 10);`

4. Criar nova colabora no banco com a senha hasherizada e o login (email) recebido no body da request

### Criar rota de login

1. Criar rota de login em `colaboradorasRoute.js`
   `$ router.post('/login', controller.login);`

2. Buscar colaboradora a partir do email recebido na request, e mostrar um erro 404 caso não encontre
   `$ Colaboradoras.findOne({ email: req.body.email }, function(error, colaboradora) {...}`

3. Comparar senha de colaboradora encontra com a senha recebida via request, e mostrar um erro 401 caso seja diferente
   `$ bcrypt.compareSync(request.body.senha, colaboradoraEncontrada.senha);`

4. Fazer require do plugin JWT
   `$ const jwt = require('jsonwebtoken');`

5. Importar SECRET e gerar token JWT a partir do nome e secret e devolver na request
   `$ jwt.sign({ name: colaboradora.name }, SECRET);`

6. Bater na rota `getAll` via Postman com o token gerado