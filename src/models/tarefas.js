const mongoose = require('mongoose');

const tarefasSchema = new mongoose.Schema({
    id : { type : Number},
    descricao: { type: String },
    dataInclusao: { type: String },
    concluido: { type: Boolean },
    nomeColaboradora: { type: String }
},{
    versionKey: false
});

const Tarefas = mongoose.model('tarefas', tarefasSchema);

module.exports = Tarefas;
