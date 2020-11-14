const express = require("express");
const router = express.Router();
const controller = require('../controllers/colaboradorasController');

router.post('/', controller.create);
router.post('/login', controller.login);
router.get('/', controller.getAll);

module.exports = router;
