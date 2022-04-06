const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
    date : {
        type: String,
        required: true
    },
    payer : {
        type: Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model('Expense',expenseSchema);