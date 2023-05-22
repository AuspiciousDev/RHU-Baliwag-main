const express = require("express");
const router = express.Router();
const requestController = require("../../controller/requestController");

router.post("/create", requestController.createDoc);

module.exports = router;
