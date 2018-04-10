const mongoose = require('mongoose');
const { Schema } = mongoose;
const BudgetItemSchema = require('./BudgetItem');

const budgetMonthSchema = new Schema({
    month: Number,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    year: Number,
    limit: { type: Number, default: 100 },
    budgetItems: [BudgetItemSchema]
});

budgetMonthSchema.index({ month: 1, _user: 1, year: 1 }, { unique: true })

mongoose.model('budgetMonths', budgetMonthSchema);