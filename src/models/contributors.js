const mongoose = require('mongoose')

const contributorsSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String }
},{
    //está aqui para que não seja gerada uma nova versão para cada atualização do documento
    versionKey: false
})

// aqui eu:
// - capturo o que entrou no meu schema (contributorsSchema) 
// - faço com que o mongoose crie uma collection "contributors"
const contributors = mongoose.model('contributors', contributorsSchema)

// exporto a collection que acabei de criar com a ajuda do mongoose.
module.exports = contributors
