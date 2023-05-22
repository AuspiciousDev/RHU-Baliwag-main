const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    medID: {
      type: String,
      required: true,
    },
    genericName: {
      type: String,
      required: true,
      lowercase: true,
    },
    brandName: {
      type: String,
      lowercase: true,
    },
    access: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    lotNum: {
      type: String,
      required: true,
      lowercase: true,
    },
    manufactureDate: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Inventory", schema);
