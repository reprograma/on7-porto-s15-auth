//apontamento do model que criamos para as Tarefas
//const { JsonWebTokenError } = require('jsonwebtoken');
const tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const getAll = (req, res) => {
  const authHeader = req.get('authorization');

if (!authHeader) {
  return res.status(401).send("Header não encontrado")
}

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Token inválido');
    }
    
    tarefas.find(function(err, tarefas){
      if(err) { 
        return res.status(500).send({ message: err.message })
      }
        return res.status(200).send(tarefas);
    });
  });
};

const getById = (req, res) => {
  const id = req.params.id;
  const authHeader = req.get('authorization');

if (!authHeader) {
  return res.status(401).send("Header não encontrado")
}

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Token inválido');
    }
  tarefas.find({ id }, function(err, tarefas){
    if(err) { 
      res.status(500).send({ message: err.message })
    }

    res.status(200).send(tarefas);
  });
});
};

const postTarefa = (req, res) => {
  const authHeader = req.get('authorization');

if (!authHeader) {
  return res.status(401).send("Header não encontrado")
}

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Token inválido');
    }
  
  let tarefa = new tarefas(req.body)

  tarefa.save(function(err){
    if(err) { 
      res.status(500).send({ message: err.message })
    }
    res.status(201).send(tarefa.toJSON())
  });
});
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send("Header não encontrado")
  }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, SECRET, function(erro) {
      if (erro) {
        return res.status(403).send('Token inválido');
      };
  
  tarefas.find({ id }, function(err, tarefa){
    if(tarefa.length > 0){
      tarefas.deleteOne({ id }, function(err){
        if(err) { 
          return res.status(424).send({ message: err.message });
        };
          return res.status(200).send('Tarefa removida com sucesso');
      });
    } else {
          return res.status(404).send('Não há tafera para ser removida');
    };
  });
});
};

const deleteTarefaConcluida = (req, res) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send("Header não encontrado")
  }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, SECRET, function(erro) {
      if (erro) {
        return res.status(403).send('Token inválido');
      };
      tarefas.find({ concluido: true }, (err, tarefa) => {
        if (tarefa.length > 0) {
          tarefas.deleteMany({ concluido: true }, err => {
            if (err) {
              return res.status(424).send({ message: err.message });
            };
            return res.status(200).send('Tarefa(s) deletada(s) com sucesso');
          });
        };
      });
    });
  };
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
      
      tarefas.updateOne({ id }, { $set : req.body }, function (err) {
        if (err) {
          return res.status(424).send({ message: err.message })
        };
          return res.status(200).send('Registro alterado com sucesso');
      });
    } else {
          return res.status(404).send('Tarefa não encontrada');
    };
  });
});
};

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa
};
