const contributors = require('../models/contributors')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const postContributor = (req, res) => {
  const passwordHash = bcrypt.hashSync(req.body.password, 10)
  req.body.password = passwordHash
  const collaborator = new contributors(req.body)

  collaborator.save(function(err) {
    if (err) {
      res.status(500).send({ message: err.message })
    }
    res.status(201).send(collaborator.toJSON())
  })
}

const getAll = (req, res) => {
  contributors.find(function(err, contributors) {
    if(err) {
      res.status(500).send({ message: err.message })
    }
    res.status(200).send(contributors);
  })
};


const login = (req, res) => {
  contributors.findOne({ email: req.body.email }, function(error, collaborator) {
    if (!collaborator) {
      return res.status(404).send(`Não existe collaborator com o email ${req.body.email}`);
    }

    const passwordValida = bcrypt.compareSync(req.body.password, collaborator.password);

    if (!passwordValida) {
      return res.status(403).send('que password é essa hein');
    }

    const token = jwt.sign({ email: req.body.email }, SECRET);

    return res.status(200).send(token);
  });
}


module.exports = {
  postContributor,
  getAll,
  login
}
