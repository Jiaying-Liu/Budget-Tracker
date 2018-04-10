const mongoose = require('mongoose');
const { Schema } = mongoose;
const BudgetItemSchema = require('./BudgetItem');

const userSchema = new Schema({
    googleId: String,
    defaultBudget: { type: Number, default: 0 },
    defaultBudgetItems: [BudgetItemSchema]
});

mongoose.model('users', userSchema);