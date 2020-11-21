const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorasController");
process.env.PATH

router.get("/", controller.getAll);
router.post("/", controller.postColaboradora);
router.post('/login', controller.login);

module.exports = router; 