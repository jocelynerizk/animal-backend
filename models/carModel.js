const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const carSchema = new Schema({
    immatricule: { type: String, required: true, unique: true},
    brand: { type: String},
    catID: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    teamid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },    
    ownerid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },    
    superid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },  

    caracteristic: {
        frigo: { type: String },
        method: { type: String },
        composition: { type: String },
    },
    certidate: { type: Date},  // Fixed typo 'date' to 'Date'
    dtenservice: { type: Date},  // Fixed typo 'date' to 'Date'
    maxweight: { type: String},
    status: { 
        type: String, 
        enum: ['pending', 'tobeaudited', 'audited', 'locked', 'conforme', 'Notconforme', 'horservice'], 
        required: true, 
        default: 'pending'
    },
    loger: { type: String, required: true, unique: true},
    barcode: { type: String},
    remarks: { type: String},
    reference: { type: String},
}, { timestamps: true });

// Create a compound index for immatricule and ownerid
// carSchema.index({ immatricule: 1, ownerid: 1 }, { unique: true });


const Car = model('Car', carSchema);

module.exports = Car;
