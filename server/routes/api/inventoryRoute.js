const express = require("express");
const router = express.Router();
const inventoryController = require("../../controller/inventoryController");

router.get("/", inventoryController.getAllDoc);
router.patch("/update/:medID", inventoryController.updateDocByID);
router.get("/search/:medID", inventoryController.getDocByID);
router.post("/create", inventoryController.createDoc);
router.delete("/delete/:medID", inventoryController.deleteDocByID);
router.patch("/update/status/:medID", inventoryController.toggleDocStatus);

module.exports = router;
