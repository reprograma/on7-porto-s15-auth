const Tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const autenticar = (req, res) => {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  };
  const token = authHeader.split(' ')[1];
  return token;
};

const getAll = (req, res) => {
  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Tarefas.find((err, tarefas) => {
      if (err) {
        return res.status(424).send({ message: err.message });
      };
      return res.status(200).send(tarefas);
    });
  });
};


const getById = (req, res) => {
  const id = req.params.id;
  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Tarefas.find({ id }, (err, tarefa) => {
      if (!tarefa.length) {
        return res.status(404).send('Tarefa não encontrada');
      };

      if (err) {
        return res.status(424).send({ message: err.message });
      };
      return res.status(200).send(tarefa);
    });
  });
};

const postTarefa = (req, res) => {
  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    let tarefa = new Tarefas(req.body);

    tarefa.save(err => {
      if (err) {
        return res.status(424).send({ message: err.message });
      };
      return res.status(201).send(tarefa);
    });
  });
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;
  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Tarefas.find({ id }, (err, tarefa) => {
      if (!tarefa.length) {
        return res.status(404).send('Tarefa não encontrada');
      } else {
        Tarefas.deleteOne({ id }, err => {
          if (err) {
            return res.status(424).send({ message: err.message });
          };
          return res.status(200).send('Tarefa excluída com sucesso');
        });
      };
    });
  });
};

const deleteTarefaConcluida = (req, res) => {
  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Tarefas.find({ concluido: true }, (err, tarefas) => {
      if (!tarefas.length) {
        return res.status(404).send('Tarefa não encontrada');
      } else {
        Tarefas.deleteMany({ concluido: true }, err => {
          if (err) {
            return res.status(424).send({ message: err.message });
          };
          return res.status(200).send('Tarefa(s) excluída(s) com sucesso');
        });
      };
    });
  });
};

const putTarefa = (req, res) => {
  const id = req.params.id;

  const token = autenticar(req, res);

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Tarefas.find({ id }, (err, tarefa) => {
      if (!tarefa.length) {
        return res.status(404).send('Tarefa não encontrada');
      } else {
        Tarefas.updateOne({ id }, { $set: req.body }, err => {
          if (err) {
            return res.status(424).send({ message: err.message })
          };
          return res.status(200).send('Tarefa atualizada com sucesso');
        });
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
