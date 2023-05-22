const express = require("express");
const router = express.Router();
const requestController = require("../../controller/requestController");

router.get("/", requestController.getAllDoc);
router.get("/info/", requestController.getAllDocInfo);
router.patch("/update/:reqID", requestController.updateDocByID);
router.get("/search/:reqID", requestController.getDocByID);
router.post("/create", requestController.createDoc);
router.delete("/delete/:reqID", requestController.deleteDocByID);
router.patch("/update/status/:reqID", requestController.toggleDocStatus);

module.exports = router;
