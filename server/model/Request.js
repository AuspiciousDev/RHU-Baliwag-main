const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    reqID: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    prescriptionIMG_URL: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
    },
    releasingDate: {
      type: String,
    },
    actionBy: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Request", schema);
