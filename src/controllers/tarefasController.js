const tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET
const jwt = require('jsonwebtoken')

const getAll = (req, res) => {
  const authHeader = req.get ('authorization');
  if (!authHeader) {
    return res.status(401).send('oxe, cadê os negoço do header?')
  }
    const token = authHeader.split('') [1];  
  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Nãm')
    }
    tarefas.find(function(err, tarefas){
      if(err) { 
        res.status(500).send({ message: err.message })
      }
      res.status(200).send(tarefas);
    })
  });
};
  
  

const getById = (req, res) => {
  const id = req.params.id;
  const authHeader = req.get ('authorization');
  if (!authHeader) {
    return res.status(401).send('oxe, cadê os negoço do header?')
  }
    const token = authHeader.split('') [1];  
  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Nãm')
    }
  tarefas.find({ id }, function(err, tarefas){
    if(err) { 
      res.status(500).send({ message: err.message })
    }
    res.status(200).send(tarefas);
    })
  })
};

const postTarefa = (req, res) => {
  const authHeader = req.get ('authorization');
  if (!authHeader) {
    return res.status(401).send('oxe, cadê os troço do header?')
  }
    const token = authHeader.split('') [1];  
  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Nãm')
    }
    
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
  const id = req.params.id;
  const authHeader = req.get('authorization');
    if (!authHeader) {
    return res.status(401).send('E o Header Criatura?!');
  };
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    }; 
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
  //Deleta quando concluido = true
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  };

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };
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
  const id = req.params.id;
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  };

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };
  tarefas.find({ id }, function(err, tarefa){
    if(tarefa.length> 0){     
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
}
