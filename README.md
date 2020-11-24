# on6-MINAS-s15-jwt

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

7. Criar variável contendo a SECRET
`$ const secret = process.env.SECRET`

8. Criar método de autenticação em `getAll`

9. Pegar o header de autorização e enviar uma mensagem de erro 401 quando vir vazio
`$ const authHeader = request.get('authorization');`

10. Passar bearer token no header de autenticação via Postman
`$ Bearer TOKEN_JWT_AQUI`

11. Verificar token JWT e enviar uma mensagem de erro 403 caso seja inválido
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
