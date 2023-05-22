const Transaction = require("../model/Transaction");
const Request = require("../model/Request");
const Inventory = require("../model/Inventory");
const currDate = new Date();
const { format, addDays } = require("date-fns");
const Dispense = require("../model/Dispense");
const transactionController = {
  getAllDoc: async (req, res) => {
    try {
      const doc = await Transaction.find().sort({ createdAt: -1 }).lean();
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: requestController.js:10 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDocInfo: async (req, res) => {
    try {
      const doc = await Transaction.aggregate([
        {
          $lookup: {
            from: "requests",
            localField: "reqID",
            foreignField: "reqID",
            as: "details",
          },
        },
        {
          $unwind: {
            path: "$details",
          },
        },
        {
          $set: {
            username: {
              $toString: "$details.username",
            },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      console.log(
        "🚀 ~ file: transactionController.js:44 ~ getAllDocInfo: ~ doc:",
        doc
      );
      if (doc.length <= 0)
        return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: requestController.js:10 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { username, reqID, items, releasingDate } = req.body;
      console.log(
        "🚀 ~ file: transactionController.js:23 ~ createDoc: ~ req.body",
        req.body
      );
      if (!username) emptyFields.push("Username");
      if (!reqID) emptyFields.push("Request ID");
      if (!items) emptyFields.push("Items");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const findDoc = await Request.findOne({ reqID }).lean().exec();
      if (!findDoc)
        return res.status(409).json({ message: "Request does not exists!" });

      const docObject = {
        username,
        reqID,
        items,
        releasingDate,
      };
      const createDoc = await Transaction.create(docObject);

      // let bulkTags = [];
      // items.forEach(async (tag) => {
      //   bulkTags.push({
      //     updateOne: {
      //       filter: {
      //         lotNum: tag.lotNum,
      //       },
      //       update: {
      //         $inc: {
      //           quantity: -tag.quantity,
      //         },
      //       },
      //       upsert: true,
      //     },
      //   });
      // });

      // Inventory.bulkWrite(bulkTags, (error, result) => {
      //   if (error) {
      //     res.status(400).json({ message: error.message });
      //   } else {
      //     console.log(
      //       "🚀 ~ file: SaleController.js:53 ~ Inventory.bulkWrite ~ result",
      //       result
      //     );
      //   }
      // });
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:31 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    const transID = req.params.transID;
    if (!transID)
      return res.status(400).json({ message: "Transaction ID is required!" });
    try {
      const doc = await Transaction.findOne({ transID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Transaction ID [${transID}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:94 ~ getDocByID: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  getAllTrans: async (req, res) => {
    const newCurrDate = addDays(currDate, 1);

    try {
      const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .lean();
      if (!transactions)
        return res.status(204).json({ message: "No transaction Found!" });
      const transactionUpdate = await Transaction.find({
        releasingDate: currDate,
      })
        .sort({ createdAt: -1 })
        .lean();
      console.log(
        "🚀 ~ file: RestockController.js:70 ~ getAllRestock: ~ restockUpdate",
        transactionUpdate
      );
      let bulkStatus = [];
      transactions
        .filter((tag) => {
          return (
            tag.status === "releasing" &&
            format(new Date(newCurrDate), "MMMM dd yyyy") >=
              format(new Date(tag.releasingDate), "MMMM dd yyyy")
          );
        })
        .map((tag) => {
          return bulkStatus.push({
            updateOne: {
              filter: {
                transID: tag?.transID,
              },
              update: {
                $set: {
                  status: "unclaimed",
                },
              },
              upsert: true,
            },
          });
        });
      Transaction.bulkWrite(bulkStatus, (error, result) => {
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          // console.log(
          //   "🚀 ~ file: RestockController.js:139 ~ Restock.bulkWrite ~ error",
          //   error
          // );
        }
      });
      res.status(200).json(transactions);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:144 ~ getAllTrans: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByReqID: async (req, res) => {
    const reqID = req.params.reqID;
    if (!reqID)
      return res.status(400).json({ message: "Request ID is required!" });
    try {
      const doc = await Transaction.findOne({ reqID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Request ID [${reqID}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:94 ~ getDocByID: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByReqID: async (req, res) => {
    const reqID = req.params.reqID;
    if (!reqID)
      return res.status(400).json({ message: "Request ID is required!" });
    try {
      const doc = await Transaction.findOne({ reqID }).exec();
      const { items } = req.body;
      if (!doc)
        return res.status(204).json({
          message: `Request ID [${reqID}] not found on Transactions!`,
        });
      const update = await Transaction.findOneAndUpdate(
        { reqID },
        { $push: { items: items }, upsert: true }
      );
      if (!update) {
        return res.status(400).json({ message: "Stock update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:131 ~ updateDocByReqID: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    const transID = req.params.transID;
    if (!transID)
      return res.status(400).json({ message: "Transaction ID is required!" });
    try {
      if (transID.length !== 24)
        return res.status(400).json({ message: "Transaction ID is invalid!" });
      const doc = await Transaction.findOne({ transID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Transaction ID [${transID}] not found!` });
      const deleteDoc = await doc.deleteOne({ transID });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    const transID = req.params.transID;
    if (!transID)
      return res.status(400).json({ message: `Transaction ID is required!` });
    try {
      const { transID, items, transactor, status, releasedDate } = req.body;
      console.log(
        "🚀 ~ file: transactionController.js:179 ~ toggleDocStatus: ~ req.body:",
        req.body
      );
      const doc = await Transaction.findOne({ transID }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Transaction ID [${transID}] not found!` });

      const update = await Transaction.findOneAndUpdate(
        { transID },
        {
          transactor,
          status,
          releasedDate,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "Stock update failed!" });
      }
      let bulkTags = [];
      let bulkInsert = [];
      items.forEach(async (tag) => {
        bulkTags.push({
          updateOne: {
            filter: {
              medID: tag.medID,
            },
            update: {
              $inc: {
                quantity: -tag.quantity,
              },
            },
            upsert: true,
          },
        });
      });

      Inventory.bulkWrite(bulkTags, (error, result) => {
        if (error) {
          res.status(400).json({ message: error.message });
        } else {
          console.log(
            "🚀 ~ file: transactionController.js:214 ~ Inventory.bulkWrite ~ result:",
            result
          );
        }
      });
      const insManyRecCount = Dispense.insertMany(items);
      console.log(update);
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:230 ~ toggleDocStatus: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },

  reportGenerateMonth: async (req, res) => {
    const apiMonth = req.params.month;
    const apiYear = req.params.year;
    console.log(
      "🚀 ~ file: transactionController.js:348 ~ reportGenerate: ~ req.body:",
      req.params
    );

    try {
      const doc = await Dispense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${apiYear}-${apiMonth}-01`),
              $lt: new Date(`${apiYear}-${parseInt(apiMonth) + 1}-01`),
            },
          },
        },
        {
          $group: {
            _id: "$medID",
            totalAmount: {
              $sum: "$quantity",
            },
            brandName: {
              $first: "$brandName",
            },
            brandName: {
              $first: "$brandName",
            },
            genericName: {
              $first: "$genericName",
            },
          },
        },
        {
          $sort: {
            totalAmount: -1,
          },
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:352 ~ reportGenerate: ~ error:",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  reportGenerateDated: async (req, res) => {
    const apiStartDate = req.params.startDate;
    const apiEndDate = req.params.endDate;
    console.log(
      "🚀 ~ file: transactionController.js:348 ~ reportGenerateDated: ~ req.body:",
      req.params
    );

    try {
      const doc = await Dispense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(apiStartDate),
              $lte: new Date(apiEndDate),
            },
          },
        },
        {
          $group: {
            _id: "$medID",
            totalAmount: {
              $sum: "$quantity",
            },
            brandName: {
              $first: "$brandName",
            },
            brandName: {
              $first: "$brandName",
            },
            genericName: {
              $first: "$genericName",
            },
          },
        },
        {
          $sort: {
            totalAmount: -1,
          },
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      console.log(
        "🚀 ~ file: transactionController.js:431 ~ reportGenerateDated: ~ doc:",
        doc
      );
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:352 ~ reportGenerate: ~ error:",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  reportGenerateDaily: async (req, res) => {
    console.log(
      "🚀 ~ file: transactionController.js:393 ~ reportGenerateDaily: ~ reportGenerateDaily:"
    );
    console.log("DailyGenerate");

    try {
      const doc = await Dispense.aggregate([
        {
          $match: {
            createdAt: new Date(),
          },
        },
        {
          $group: {
            _id: "$medID",
            totalAmount: {
              $sum: "$quantity",
            },
            brandName: {
              $first: "$brandName",
            },
            brandName: {
              $first: "$brandName",
            },
            genericName: {
              $first: "$genericName",
            },
          },
        },
        {
          $sort: {
            totalAmount: -1,
          },
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: transactionController.js:352 ~ reportGenerate: ~ error:",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = transactionController;
