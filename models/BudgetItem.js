const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetItemSchema = new Schema({
    name: String,
    category: String,
    amount: { type: Number, default: 0 }
});

module.exports = budgetItemSchema;