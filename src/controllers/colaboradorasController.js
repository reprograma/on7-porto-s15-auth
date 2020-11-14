const Colaboradoras = require('../models/colaboradoras');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaHash = bcrypt.hashSync(req.body.senha, 10);
  req.body.senha = senhaHash;
  const colaboradora = new Colaboradoras(req.body);

  colaboradora.save(function(err) {
    if (err) {
      res.status(500).send({ message: err.message })
    }

    res.status(201).send(colaboradora.toJSON())
  })
};

const login = (req, res) => {
  Colaboradoras.findOne({ email: req.body.email }, function(error, colaboradora) {
    if (!colaboradora) {
      return res.status(404).send(`Não encontramos nenhuma colaboradora com o email ${req.body.email} ${colaboradora}!`);
    }

    const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);

    if (!senhaValida) {
      return res.status(401).send('Senha incorreta!');
    }

    const token = jwt.sign({ name: colaboradora.name }, SECRET);
    return res.status(200).send(token);
  });
}

const getAll = (req, res) => {
  Colaboradoras.find(function(err, colaboradoras){
    if(err) {
      res.status(500).send({ message: err.message })
    }
    res.status(200).send(colaboradoras);
  })
};

module.exports = {
  create,
  login,
  getAll
}
