const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorasController");

router.get("/", controller.getAllColabs);
router.post("/login", controller.login);
router.post("/", controller.create);

module.exports = router;
