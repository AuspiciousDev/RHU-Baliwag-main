const Inventory = require("../model/Inventory");
const ACCESS_LIST = require("../config/access_list");
const inventoryController = {
  getAllDoc: async (req, res) => {
    try {
      const doc = await Inventory.find().sort({ createdAt: -1 }).lean();
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: inventoryController.js:10 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  createDoc: async (req, res) => {
    let emptyFields = [];
    const {
      medID,
      lotNum,
      genericName,
      brandName,
      access,
      quantity,
      createdBy,
      supplier,
      manufactureDate,
      expiryDate,
    } = req.body;
    try {
      if (!medID) emptyFields.push("Medicine ID");
      if (!lotNum) emptyFields.push("Lot Number");
      if (!genericName) emptyFields.push("Generic Name");
      if (!access) emptyFields.push("Access");
      if (!ACCESS_LIST.includes(access)) emptyFields.push("Invalid Access");
      if (!quantity) emptyFields.push("Quantity");
      if (!supplier) emptyFields.push("Supplier");
      if (!manufactureDate) emptyFields.push("Manufacture Date");
      if (!expiryDate) emptyFields.push("Expiry Date");
      if (!createdBy) emptyFields.push("Created By");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const duplicate = await Inventory.findOne({
        medID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Inventory Stock!" });

      // Create Object
      const docObject = {
        medID,
        lotNum,
        genericName,
        brandName,
        access,
        quantity,
        createdBy,
        supplier,
        manufactureDate,
        expiryDate,
      };
      // Create and Store new Doc
      const response = await Inventory.create(docObject);
      res.status(201).json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: inventoryController.js:73 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req.params.medID)
        return res.status(400).json({ message: "Stock ID is required!" });
      const medID = req.params.medID;
      const doc = await Inventory.findOne({ medID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Stock ID [${medID}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log("🚀 ~ file: inventoryController.js:88 ~ getDocByID: ~ o", o);
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.medID)
        return res.status(400).json({ message: "Stock ID is required!" });
      const {
        medID,
        lotNum,
        genericName,
        brandName,
        access,
        quantity,
        walkInQTY,
        onlineQTY,
        supplier,
        createdBy,
      } = req.body;
      const findDoc = await Inventory.findOne({ medID }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Stock ID [${medID}] does not exists!` });
      const docObject = {
        lotNum,
        genericName,
        brandName,
        access,
        quantity,
        walkInQTY,
        onlineQTY,
        supplier,
        createdBy,
      };
      const update = await Inventory.findOneAndUpdate({ medID }, docObject);
      if (update) {
        res.status(200).json({ message: "Stock update success!" });
      } else {
        return res.status(400).json({ message: "Stock update failed!" });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: inventoryController.js:131 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    if (!req.params.medID)
      return res.status(400).json({ message: "Stock ID is required!" });
    try {
      const medID = req.params.medID;
      const doc = await Inventory.findOne({ medID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Stock ID [${medID}] not found!` });
      const deleteDoc = await doc.deleteOne({ medID });
      res.json(deleteDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: inventoryController.js:147 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    if (!req?.params?.medID)
      return res.status(400).json({ message: `Stock ID is required!` });
    try {
      const medID = req.params.medID;
      const { status } = req.body;
      const doc = await Inventory.findOne({ medID }).exec();

      if (!doc)
        return res
          .status(204)
          .json({ message: `Stock ID [${medID}] not found!` });
      const update = await Inventory.findOneAndUpdate(
        { medID },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "Stock update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: inventoryController.js:185 ~ toggleDocStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = inventoryController;
