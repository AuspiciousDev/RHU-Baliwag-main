const Restock = require("../model/Restock");
const Inventory = require("../model/Inventory");
const restockController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    const { medID, lotNum, quantity, supplier, restockedBy, deliveryDate } =
      req.body;
    try {
      if (!medID) emptyFields.push("Medicine ID");
      if (!lotNum) emptyFields.push("Lot Number");
      if (!quantity) emptyFields.push("Quantity");
      if (!supplier) emptyFields.push("Supplier");
      if (!deliveryDate) emptyFields.push("Delivery Date");
      if (!restockedBy) emptyFields.push("Restocked By");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const restockObj = {
        medID,
        lotNum,
        quantity,
        supplier,
        restockedBy,
        deliveryDate,
      };
      const findDoc = await Inventory.findOne({ medID }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Item [${medID}] does not exists!` });
      const createRestock = await Restock.create(restockObj);
      const updateInventory = await Inventory.findOneAndUpdate(
        { medID },
        {
          $inc: {
            quantity: quantity,
          },
          supplier,
        },
        { new: true }
      );
      console.log(
        "🚀 ~ file: restockController.js:36 ~ createDoc: ~ updateInventory",
        updateInventory
      );
      res.status(201).json(createRestock);
    } catch (error) {
      console.log(
        "🚀 ~ file: restockController.js:15 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await Restock.aggregate([
        {
          $lookup: {
            from: "inventories",
            localField: "medID",
            foreignField: "medID",
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
            genericName: {
              $toString: "$details.genericName",
            },
            brandName: {
              $toString: "$details.brandName",
            },
          },
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: restockController.js:24 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    const _id = req.params._id;
    if (!_id)
      return res.status(400).json({ message: "Restock ID is required!" });
    try {
      if (_id.length !== 24)
        return res.status(400).json({ message: "Restock ID is invalid!" });
      const doc = await Restock.findOne({ _id }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Restock ID [${_id}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: restockController.js:47 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // updateDocByID: async (req, res) => {
  //   if (!req.params._id)
  //     return res.status(400).json({ message: "Restock ID is required!" });
  //   try {
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  deleteDocByID: async (req, res) => {
    const _id = req.params._id;
    if (!_id)
      return res.status(400).json({ message: "Restock ID is required!" });
    try {
      if (_id.length !== 24)
        return res.status(400).json({ message: "Restock ID is invalid!" });
      const doc = await Restock.findOne({ _id }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Restock ID [${_id}] not found!` });
      const deleteDoc = await doc.deleteOne({ _id });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = restockController;
