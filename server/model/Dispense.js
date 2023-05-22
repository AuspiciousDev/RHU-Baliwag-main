const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    medID: {
      type: String,
      required: true,
      lowercase: true,
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
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Dispense", schema);
