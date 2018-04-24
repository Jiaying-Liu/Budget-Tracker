const mongoose = require('mongoose');
const { Schema } = mongoose;
const BudgetItemSchema = require('./BudgetItem');

const userSchema = new Schema({
    googleId: String,
    name: String,
    defaultBudget: { type: Number, default: 0 },
    defaultBudgetItems: [BudgetItemSchema],
    categories: { type: [String], default: ['Food', 'Housing'] }
});

mongoose.model('users', userSchema);