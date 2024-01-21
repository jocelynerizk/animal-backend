const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // verfied:{type:Boolean ,default:false}
    phoneNumber: { type: Number, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "employee", "client"],
      required: true,
      default: "client",
    },
    firebaseUid: { type: String },
  },
  { timestamps: true }
);
const user = model("user", userSchema);

module.exports = user;