const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()

//String de conexão
mongoose.connect("mongodb://localhost:27017/reprograma", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

//Conexão com o mongo
let db = mongoose.connection;

// Captura de erro ou sucesso na conexão
db.on("error", console.log.bind(console, "connection error:"))
db.once("open", function (){
  console.log("conexão feita com sucesso.")
})

//rotas
const index = require("./routes/index")
const tarefas = require("./routes/tarefasRoute")
const colaboradoras = require("./routes/colaboradorasRoute")

//configurar body parser
app.use(bodyParser.json());
// app.use(express.json()); - Podemos usar a propria função de parser de json do express, sem a necessidade de instalar o body parser 

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
  })

app.use("/", index)
app.use("/tarefas", tarefas)
app.use("/colaboradoras", require("./routes/colaboradorasRoute"))

module.exports = app
