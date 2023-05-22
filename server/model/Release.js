const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    releaseID: {
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
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    qrCodeURL: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: String,
      required: true,
    },
    releasedBy: {
      type: String,
      required: true,
    },
    releasedDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Release", schema);
