const express = require("express");
const router = express.Router();
const inventoryController = require("../../controller/inventoryController");

router.get("/", inventoryController.getAllDoc);
module.exports = router;
