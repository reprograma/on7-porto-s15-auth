require('dotenv-safe').config();

const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasksController');

router.get('/', controller.getAllTasks);
router.get('/filtrodeconclusao', controller.getByConclusion);
router.post('/', controller.postTask);
router.delete('/excluirporid/:id', controller.deleteTaskByID);
router.delete('/excluirconcluidas', controller.deleteTaskConcluded);
// router.put('/:id', controller.putTarefa);

module.exports = router;
