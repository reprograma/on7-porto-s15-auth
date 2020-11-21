const tasks = require('../models/tasks')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET


const postTask = (req, res) => {

  const authHeader = req.get('authorization')

  if (!authHeader) {
    return res.status(401).send(`Por favor, insira seu token.`)
  }

  const token = authHeader.split(' ')[1]
  
  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send(`Acesso negado.`)
    }
  
  let task = new tasks(req.body)

  task.save(function(err){
    if (err) {
      res.status(500).send({ message: err.message })
    }
    res.status(201).send(task.toJSON())
    })
  })
}

const getAllTasks = (req, res) => {

  const authHeader = req.get('authorization')

  if (!authHeader) {
    return res.status(401).send(`Por favor, insira seu token.`)
  }

  const token = authHeader.split(' ')[1]
  
  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send(`Acesso negado.`)
    }

    tasks.find(function(err, tasks){
      if (err) {
        res.status(500).send({ message: err.message })
      }
      res.status(200).send(tasks)
    })
  })
}

const getByConclusion = (req, res) => {
  const completed = req.query.completed
    tasks.find({ completed }, function(err, tasks){
    if (err) {
      res.status(500).send({ message: err.message })
    }

    res.status(200).send(tasks)
  })
}

const deleteTaskByID = (req, res) => {
  const id = req.params.id

  tasks.find({ id }, function(err, task){
    if (task.length > 0){
      tasks.deleteMany({ id }, function(err){
        if (err) {
          res.status(500).send({ message: err.message })
        }
        res.status(200).send({ message: `A tarefa com o ID ${id} foi excluída com sucesso` })
      })
    } else {
      res.status(200).send({ message: `Não há tarefa registrada com o ID ${id} para ser removida.` })
    }
  })
}

const deleteTaskConcluida = (req, res) => {
  
  const authHeader = req.get('authorization')
  if (!authHeader) {
    return res.status(401).send(`Por favor, insira seu token.`)
  }

  const token = authHeader.split(' ')[1] 

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send(`Acesso negado`)
    }

      tasks.deleteMany({ 'completed' : true }, function(err){
        if (err) {
          res.status(500).send({ message: err.message })
        }
        res.status(200).send({ message: `A tarefa foi excluída com sucesso` })
      })
  })
}

// const putTask = (req, res) => {
//   const id = req.params.id

//   tasks.find({ id }, function(err, task){
//     if(task.length> 0){
//       tasks.updateMany({ id }, { $set : req.body }, function (err) {
//         if (err) {
//           res.status(500).send({ message: err.message })
//         }
//         res.status(200).send({ message: "Registro alterado com sucesso"})
//       })
//     }else {
//       res.status(200).send({ message: "Não há registros para serem atualizados com esse id"})
//     }
//   })
// }

module.exports = {
  getAllTasks,
  getByConclusion,
  postTask,
  deleteTaskByID,
  deleteTaskConcluida,
  // putTask
}
