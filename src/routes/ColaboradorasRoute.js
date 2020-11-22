const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorasController"); 

router.get("/", controller.getAllColaboradoras);
router.get("/", controller.postColaboradoras);


module.exports = router;
