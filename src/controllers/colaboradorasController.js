const Colaboradoras = require('../models/colaboradoras');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);
  req.body.senha = senhaComHash;
  const colaboradora = new Colaboradoras(req.body);

  colaboradora.save(err => {
    if (err) {
      return res.status(424).send({ message: err.message });
    };

    return res.status(201).send(colaboradora);
  });
};

const getAll = (req, res) => {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).send('Header não encontrado');
  };
  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, err => {
    if (err) {
      return res.status(403).send('Token inválido');
    };

    Colaboradoras.find((err, colaboradoras) => {
      if(err) {
        return res.status(424).send({ message: err.message });
      };
      return res.status(200).send(colaboradoras);
    });
  });  
};

const login = (req, res) => {
  Colaboradoras.findOne({ email: req.body.email }, (err, colaboradora) => {
    if(err) {
      return res.status(424).send({ message: err.message });
    };

    if (!colaboradora) {
      return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}`);
    };

    const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);

    if (!senhaValida) {
      return res.status(403).send('Senha inválida');
    };

    const token = jwt.sign({ email: req.body.email }, SECRET);

    return res.status(200).send(token);
  });
};

module.exports = {
  create,
  getAll,
  login
};