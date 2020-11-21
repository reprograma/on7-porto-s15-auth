//apontamento do model que criamos para as Colaboradoras
const { JsonWebTokenError } = require('jsonwebtoken');
const colaboradoras = require('../models/colaboradoras');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;



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
    
    colaboradoras.find(function(err, colaboradoras){
      if(err) { 
        return res.status(500).send({ message: err.message })
      }
        return res.status(200).send(colaboradoras);
    })
  });
};

const postColaboradora = (req, res) => {
const senhaComHash = bcrypt.hashSync(req.body.senha, bcrypt.genSaltSync(10));
req.body.senha = senhaComHash;

const colaboradora = new colaboradoras(req.body);

  colaboradora.save(function(err){
    if(err) { 
      res.status(500).send({ message: err.message })
    }
    res.status(201).send(colaboradora);
  })
};

const login = (req, res) => {

  colaboradoras.findOne( { email: req.body.email }, (err, colaboradora) => {
    if (!colaboradora) {
      return res.status(404).send(`Colaboradora com email ${req.body.email} não encontrado`);
    };

    const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);
    
    if (!senhaValida) {
      return res.status(403).send('Senha incorreta');
    }else{

    const token = jwt.sign({ email: req.body.email}, SECRET);
      return res.status(201).send(token);
    }
  });
};

module.exports = {
  getAll,
  postColaboradora,
  login
};