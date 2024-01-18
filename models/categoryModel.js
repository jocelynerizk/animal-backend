const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    title: {type: String, required: true, unique: true},
    title_a: { type: String, required: true},

},
{ timestamps: true } 
);

const category = model('category', categorySchema);

module.exports = category;
