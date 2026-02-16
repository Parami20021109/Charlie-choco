const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    batchNumber: { type: String, required: true, unique: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    quantity: { type: Number, required: true }, // Number of recipe units (batches)
    status: { 
        type: String, 
        enum: ['Initiated', 'Roasting', 'Refining', 'Mixing', 'Molding', 'Cooling', 'QC_Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Initiated' 
    },
    currentStage: { type: String, default: 'Initiated' },
    stages: [{
        name: String,
        status: { type: String, enum: ['Pending', 'In_Progress', 'Completed'], default: 'Pending' },
        startTime: Date,
        endTime: Date,
        notes: String
    }],
    qualityCheck: {
        inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        remarks: String,
        date: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Batch', BatchSchema);
