const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");

router.get("/", userController.getAllDoc);
router.get("/search/:username", userController.getDocByID);
router.post("/create", userController.createDoc);
router.post("/quick-create", userController.quickCreateDoc);
router.patch("/update/:username", userController.updateDocByID);
router.patch("/status/:username", userController.toggleDocStatus);
router.delete("/delete/:username", userController.deleteDocByID);
router.patch("/update/img/:username", userController.updateEmployeeIMG);
module.exports = router;
