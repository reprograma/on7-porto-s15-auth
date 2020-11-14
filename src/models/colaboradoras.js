const mongoose = require('mongoose');

const colaboradorasSchema = new mongoose.Schema({
    id : { type : Number},
    nome: { type: String },
    email: { type: String },
    senha: { type: String }
},
{    
    versionKey: false
});


module.exports = mongoose.model('colaboradoras', colaboradorasSchema); 