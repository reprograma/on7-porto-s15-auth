//apontamento do model que criamos para as Tarefas
const colaboradoras = require('../models/colaboradoras');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');


const getAllColaboradora = (req, res) => {
 const authHeader = req.get('authorization');

 if (!authHeader) {
   return res.status(401).send('Kd os header parça');
 }

 const token = authHeader.split(' ')[1];

 jwt.verify(token, SECRET, function(erro) {
   if (erro) {
     return res.status(403).send('Nope');
   }

   colaboradoras.find(function(err, colaboradoras){
     if(err) {
       res.status(500).send({ message: err.message })
     }
     res.status(200).send(colaboradoras);
   })
 });
};

const getById = (req, res) => {
 const id = req.params.id;
 //Find sempre retorna uma lista
 //FindOne retorna um unico documento
 tarefas.find({ id }, function(err, colaboradoras){
   if(err) {
     res.status(500).send({ message: err.message })
   }

   res.status(200).send(colaboradoras);
 })
};

const postColaboradora = (req, res) => {
 console.log(req.body)

 let colaboradora = new colaboradoras(req.body)

 tarefa.save(function(err){
   if(err) {
     res.status(500).send({ message: err.message })
   }
   res.status(201).send(colaboradora.toJSON())
 })

};

const deleteColaboradora = (req, res) => {
 const id = req.params.id;

 //deleteMany remove mais de um registro
 //deleteOne remove apenas um registro
 colaboradoras.find({ id }, function(err, colaboradora){
   if(colaboradoras.length > 0){
    colaboradoras.deleteMany({ id }, function(err){
       if(err) {
         res.status(500).send({
           message: err.message,
           status: "FAIL"
          })
       }
       res.status(200).send({
         message: 'Colaboradora removida com sucesso',
         status: "SUCCESS"
       })
     })
   }else{
     res.status(200).send({
       message: 'Não há colaboradora para ser removida',
       status: "EMPTY"
     })
   }
 })
};

const deleteColaboradoraConcluida = (req, res) => {
 //Deleta quando concluido = true
 try {
   tarefas.deleteMany({ concluido: true }, function (err) {
       if (!err) {
           res.status(200).send({ message: 'Colaboradoras removidas com sucesso', status: "SUCCESS" })
       }
   })
 } catch (err) {
   console.log(err)
   return res.status(424).send({ message: err.message })
 }
}

const putColaboradora = (req, res) => {
 const id = req.params.id;

 colaboradoras.find({ id }, function(err, colaboradora){
   if(colaboradora.length> 0){
     //faz o update apenas para quem respeitar o id passado no parametro
     // set são os valores que serão atualizados
     //UpdateMany atualiza vários registros de uma unica vez
     //UpdateOne atualiza um único registro por vez

     colaboradoras.updateMany({ id }, { $set : req.body }, function (err) {
       if (err) {
         res.status(500).send({ message: err.message })
       }
       res.status(200).send({ message: "Registro alterado com sucesso"})
     })
   }else {
     res.status(200).send({ message: "Não há registros para serem atualizados com esse id"})
   }
 })

}

module.exports = {
 getAllColaboradora,
 getById,
 postColaboradora,
 deleteColaboradora,
 deleteColaboradoraConcluida,
 putColaboradora
};
