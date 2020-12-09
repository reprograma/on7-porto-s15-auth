//apontamento do model que criamos para as Tarefas
const { JsonWebTokenError } = require('jsonwebtoken');
const tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET 
const jwt = require('jsonwebtoken')

const getAll = (req, res) => {
  const authHeader = req.get('authorization')

  if (!authHeader) {
    return res.status(401).send("kd os headers")

  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Nope')
    }
    
    tarefas.find(function(err, tarefas){
      if(err) { 
        res.status(500).send({ message: err.message })
      }
      res.status(200).send(tarefas);
    })
  })
};

const authorizeAndRun = (req, res, doAction) => {
  const authHeader = req.get('authorization')

  if(!authHeader) {
    return res.status(401).send('Authorization header missing')
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, SECRET, function(erro) {
    if(erro) {
      return res.status(403).send('Authorization is not valid')
    }

    doAction() 
  })
}


const getById = (req, res) => {
  authorizeAndRun(req, res, () => {
    const id = req.params.id;
    //Find sempre retorna uma lista
    //FindOne retorna um unico documento
    tarefas.find({ id }, function(err, tarefas){
      if(err) { 
        res.status(500).send({ message: err.message })
      }
      res.status(200).send(tarefas);
    })
  })
};




// const getById = (req, res) => {
//   const authHeader = req.get('authorization')

//   if(!authHeader) {
//     return res.status(401).send('Authorization header missing')
//   }
//   const token = authHeader.split(' ')[1]

//   jwt.verify(token, SECRET, function(erro) {
//     if(erro) {
//       return res.status(403).send('Authorization is not valid')
//     }

//     const id = req.params.id;
//     //Find sempre retorna uma lista
//     //FindOne retorna um unico documento
//     tarefas.find({ id }, function(err, tarefas){
//       if(err) { 
//         res.status(500).send({ message: err.message })
//       }
//       res.status(200).send(tarefas);
//     })
//   })
// };

const postTarefa = (req, res) => {
  authorizeAndRun(req, res, () => {
    let tarefa = new tarefas(req.body)

    tarefa.save(function(err){
      if(err) { 
        res.status(500).send({ message: err.message })
      }
      res.status(201).send(tarefa.toJSON())
    })
  })
};

const deleteTarefa = (req, res) => {
  authorizeAndRun(req, res, () => {
    const id = req.params.id;

    //deleteMany remove mais de um registro
    //deleteOne remove apenas um registro
    tarefas.find({ id }, function(err, tarefa){
      if(tarefa.length > 0){
        tarefas.deleteMany({ id }, function(err){
          if(err) { 
            res.status(500).send({ 
              message: err.message, 
              status: "FAIL" 
            })
          }
          res.status(200).send({ 
            message: 'Tarefa removida com sucesso', 
            status: "SUCCESS" 
          })
        })
      }else{
        res.status(200).send({ 
          message: 'Não há tafera para ser removida', 
          status: "EMPTY" 
        })
      }
    })
  })
  
};

const deleteTarefaConcluida = (req, res) => {
  authorizeAndRun(req, res, () => {
    //Deleta quando concluido = true
  try {
    tarefas.deleteMany({ concluido: true }, function (err) {
        if (!err) {
            res.status(200).send({ message: 'Tarefas concluidas removidas com sucesso', status: "SUCCESS" })
        }
    })
  } catch (err) {
    console.log(err)
    return res.status(424).send({ message: err.message })
  }
  })
}

const putTarefa = (req, res) => {
  authorizeAndRun(req, res, () => {
    const id = req.params.id;

    tarefas.find({ id }, function(err, tarefa){
      if(tarefa.length> 0){
        //faz o update apenas para quem respeitar o id passado no parametro
        // set são os valores que serão atualizados
        //UpdateMany atualiza vários registros de uma unica vez
        //UpdateOne atualiza um único registro por vez
        
        tarefas.updateMany({ id }, { $set : req.body }, function (err) {
          if (err) {
            res.status(500).send({ message: err.message })
          }
          res.status(200).send({ message: "Registro alterado com sucesso"})
        })
      }else {
        res.status(200).send({ message: "Não há registros para serem atualizados com esse id"})
      }
    })
  })
}

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa
};
