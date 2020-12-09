const colaboradoras = require('../models/colaboradoras.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET



const postColaboradora = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    req.body.senha = senhaComHash
    let colaboradora = new colaboradoras(req.body)
    colaboradora.save(function(err){
    if(err) { 
        res.status(500).send({ message: err.message })
    }
        res.status(201).send(colaboradora.toJSON())
    })
};

const login = (req, res) => {
    colaboradoras.findOne({email:req.body.email}, function(error, colaboradora){
        if (!colaboradora) {
            return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}`)
        }
        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha) 
        
        if (!senhaValida) {
            return res.status(403).send('que senha é essa!')
        }

        const token = jwt.sign({ email: req.body.email }, SECRET)
    
        return res.status(200).send(token)
    })
}

    module.exports = { postColaboradora, login };
