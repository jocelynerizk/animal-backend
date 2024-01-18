const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type:  String },
  vatnumb: { type: String },
  chambrecommerce: { type: String },
  fullAddress: {
    long: { type: String },
    lat: { type: String },
    dept: { type: String },
    caza: { type: String },
    region: { type: String },
  },
  role: {
    type: String,
    enum: ["admin", "team", "company"], required: true, default: 'company'
  },
  firebaseUid: { type: String },
},
  { timestamps: true });

const UserModel = model('users', userSchema);

module.exports = UserModel;