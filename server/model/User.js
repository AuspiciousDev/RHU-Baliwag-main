const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    imgURL: String,
    username: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    middleName: {
      type: String,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    telephone: {
      type: Number,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
