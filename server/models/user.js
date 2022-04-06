const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    balance : [
        /*
        {
            type: Schema.Types.ObjectId,
            ref: 'Money'
        }
        */
    ],
    expenses: [
        /*
        {
            type: Schema.Types.ObjectId,
            ref: 'Expense'
        }
        */
    ],
    incomes : [
        /*
        {
            
            type: Schema.Types.ObjectId,
            ref: 'Income'
        } 
        */
    ],
    expenseCategorys : [] ,
    incomeCategorys : [] ,
     
});

module.exports = mongoose.model('User',userSchema);