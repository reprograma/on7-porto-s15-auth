const app = require("./src/app");
const port = 3000;

app.listen(port, () => {
  console.log(`app está rodando na porta ${port}`);
});
