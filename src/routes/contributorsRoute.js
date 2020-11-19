const express = require("express");
const router = express.Router();
const controller = require('../controllers/contributorsController');

router.post('/', controller.postContributor);
router.get('/', controller.getAll);
router.post('/login', controller.login);

module.exports = router;
