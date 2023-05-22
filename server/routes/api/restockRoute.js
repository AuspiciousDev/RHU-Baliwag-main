const express = require("express");
const router = express.Router();
const restockController = require("../../controller/restockController");

router.get("/", restockController.getAllDoc);
router.get("/search/:_id", restockController.getDocByID);
router.post("/create", restockController.createDoc);
router.delete("/delete/:_id", restockController.deleteDocByID);

// router.patch("/update/:lotNum", restockController.updateDocByID);
module.exports = router;
