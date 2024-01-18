const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const requirementSchema = new Schema({
    desc: { type: String, required: true},
    desc_a: { type: String, required: true},
    catID: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
},
{ timestamps: true } 
);

requirementSchema.index({ catID: 1, desc: 1 }, { unique: true });

const Requirement = model('requirement', requirementSchema);

module.exports = Requirement;