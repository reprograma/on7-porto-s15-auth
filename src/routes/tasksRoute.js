require('dotenv-safe').config();

const express = require("express");
const router = express.Router();
const controller = require("../controllers/tasksController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.postTarefa);
router.delete("/:id", controller.deleteTarefa);
router.delete("/", controller.deleteTarefaConcluida);
router.put("/:id", controller.putTarefa);

module.exports = router;
