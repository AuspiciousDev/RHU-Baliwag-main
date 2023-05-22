const express = require("express");
const router = express.Router();
const transactionController = require("../../controller/transactionController");

router.get("/", transactionController.getAllDoc);
router.get("/allTransactions", transactionController.getAllTrans);
router.patch("/update/:transID", transactionController.updateDocByID);
router.patch("/update/req/:reqID", transactionController.updateDocByReqID);
router.get("/search/:transID", transactionController.getDocByID);
router.get("/search/req/:reqID", transactionController.getDocByReqID);
router.get("/getAllDocInfo", transactionController.getAllDocInfo);
router.post("/create", transactionController.createDoc);
router.delete("/delete/:transID", transactionController.deleteDocByID);
router.patch("/update/status/:transID", transactionController.toggleDocStatus);
router.get(
  "/reportGen/:month/:year",
  transactionController.reportGenerateMonth
);
router.get("/reportGenDaily", transactionController.reportGenerateDaily);
router.get(
  "/reportGenDated/:startDate/:endDate",
  transactionController.reportGenerateDated
);
module.exports = router;
