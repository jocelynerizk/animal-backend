const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const auditReportSchema = new Schema({
    reqID: {
        type: Schema.Types.ObjectId,
        ref: 'requirement',
        required: [true, 'reqID is required'],
    },
    carID: {
        type: Schema.Types.ObjectId,
        ref: 'car',
        required: [true, 'carID is required'],
    },
    choisi: { type: Boolean, default: false },

}, { timestamps: true });

// Add a unique compound index for reqID and carID
// auditReportSchema.index({ reqID: 1, carID: 1 }, { unique: true });

const AuditReport = model('AuditReport', auditReportSchema);

module.exports = AuditReport;
