const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    transID: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    reqID: {
      type: String,
      required: true,
    },
    items: [
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
    ],
    username: {
      type: String,
      required: false,
    },
    transactor: {
      type: String,
      required: false,
    },
    releasingDate: {
      type: String,
    },
    releasedDate: {
      type: String,
    },
    status: {
      type: String,
      default: "releasing",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Transaction", schema);
