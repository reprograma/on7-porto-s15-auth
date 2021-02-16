const contributors = require('../models/contributors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET


const postContributor = (req, res) => {

  const passwordHash = bcrypt.hashSync(req.body.password, 10)
  req.body.password = passwordHash

  const contributor = new contributors(req.body)
  contributor.save(function(err) {
    if (err) {
      res.status(500).send({ message: err.message })
    }
    res.status(201).send(contributor.toJSON())
  })

}

const getAll = (req, res) => {

  contributors.find(function(err, contributors) {
    if(err) {
      res.status(500).send({ message: err.message })
    }
    res.status(200).send(contributors)
  })

}

const login = (req, res) => {

  contributors.findOne({ email: req.body.email }, function(error, contributor) {
    if (!contributor) {
      return res.status(404).send(`Não existe nenhum colaborador com o email ${req.body.email} :(`)
    }

    const passwordValida = bcrypt.compareSync(req.body.password, contributor.password)
    if (!passwordValida) {
      return res.status(403).send('Senha incorreta, tente novamente!')
    }

    const token = jwt.sign({ email: req.body.email }, SECRET)
    return res.status(200).send(`o token da pessoa colaboradora com o email ${req.body.email} é ${token}.`)
  })
}


module.exports = {
  postContributor,
  getAll,
  login
}
