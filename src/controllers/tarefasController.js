const Tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const getAll = (req, res) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  }

  const token = authHeader.split(' ')[1];

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
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  };

  const token = authHeader.split(' ')[1];

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

  let tarefa = new Tarefas(req.body);

  tarefa.save(err => {
    if (err) {
      return res.status(424).send({ message: err.message });
    };
    return res.status(201).send(tarefa);
  });
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;

  Tarefas.find({ id }, (err, tarefa) => {
    if (tarefa.length > 0) {
      Tarefas.deleteMany({ id }, (err) => {
        if (err) {
          return res.status(424).send({ message: err.message });
        };
        return res.status(200).send('Tarefa removida com sucesso');
      });
    } else {
      return res.status(404).send('Tarefa não encontrada');
    };
  });
};

const deleteTarefaConcluida = (req, res) => {
  Tarefas.find({ concluido: true }, (err, tarefas) => {
    if (tarefas.length > 0) {
      Tarefas.deleteMany({ concluido: true }, err => {
        if (err) {
          return res.status(424).send({ message: err.message });
        };
        return res.status(200).send('Tarefa removida com sucesso');
      });
    } else {
      return res.status(404).send('Não há tarefas concluídas');
    };
  });
};

const putTarefa = (req, res) => {
  const id = req.params.id;

  Tarefas.find({ id }, (err, tarefa) => {
    if (tarefa.length > 0) {
      Tarefas.updateOne({ id }, { $set: req.body }, err => {
        if (err) {
          return res.status(424).send({ message: err.message })
        };
        return res.status(200).send('Registro alterado com sucesso');
      });
    } else {
      return res.status(200).send('Tarefa não encontrada');
    };
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
