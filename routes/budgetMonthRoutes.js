const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const BudgetMonth = mongoose.model('budgetMonths');

module.exports = (app) => {
    app.get('/api/budget_months', requireLogin, async (req, res) => {
        console.log('getting all months');
        const budgetMonths = await BudgetMonth.find({ _user: req.user.id });
        res.send(budgetMonths);
    });

    app.get('/api/budget_months/get_month', requireLogin, async(req, res) => {
        console.log('req query ', req.query);
        const budgetMonth = await BudgetMonth.findOne({
            _user: req.user.id,
            month: req.query.month,
            year: req.query.year
        });
        res.send(budgetMonth);
    });

    app.post('/api/budget_months/create', requireLogin, async (req, res) => {
        const { month, year, limit, budgetItems } = req.body;

        const existingBudgetMonth = await BudgetMonth.findOne({ 
            _user: req.user.id,
            month: month,
            year: year
        })

        if(existingBudgetMonth) {
            return res.send(existingBudgetMonth);
        }

        var data = { month, year, _user: req.user.id, budgetItems: budgetItems };

        if(limit > 0) {
            data.limit = limit;
        }
        
        var budgetMonth = new BudgetMonth(data);

        budgetMonth = await budgetMonth.save();
        res.send(budgetMonth);
    });

    app.post('/api/budget_months/update_limit', requireLogin, async (req, res) => {
        const { month, year, limit } = req.body;

        var budgetMonth = await BudgetMonth.findOne({
            _user: req.user.id,
            month: month,
            year: year
        });

        if(!budgetMonth) {
            return res.status(422).send('Budget Month Not Found');
        }

        budgetMonth.limit = limit;
        budgetMonth = await budgetMonth.save();
        res.send(budgetMonth);
    });

    app.post('/api/budget_months/add_budget_item', requireLogin, async (req, res) => {
        const { month, year, budgetItem } = req.body;

        var budgetMonth = await BudgetMonth.findOne({
            _user: req.user.id,
            month: month,
            year: year
        });

        if(!budgetMonth) {
            return res.status(422).send('Budget Month Not Found');
        }

        const { name, category, amount } = budgetItem;

        budgetMonth.budgetItems.push({
            name,
            category,
            amount
        });
        budgetMonth = await budgetMonth.save();
        res.send(budgetMonth);
    });

    app.post('/api/budget_months/save_budget_item', requireLogin, async (req, res) => {
        const { month, year, budgetItem, index } = req.body;

        var budgetMonth = await BudgetMonth.findOne({
            _user: req.user.id,
            month: month,
            year: year
        });

        if(!budgetMonth) {
            return res.status(422).send('Budget Month Not Found');
        }

        const { name, category, amount } = budgetItem;
        budgetMonth.budgetItems[index] = { name, category, amount };
        budgetMonth = await budgetMonth.save();
        res.send(budgetMonth);
    });

    app.post('/api/budget_months/remove_budget_item', requireLogin, async (req, res) => {
        const { month, year, indexToRemove } = req.body;

        var budgetMonth = await BudgetMonth.findOne({
            _user: req.user.id,
            month: month,
            year: year
        });

        if(!budgetMonth) {
            return res.status(422).send('Budget Month Not Found');
        }

        budgetMonth.budgetItems.splice(indexToRemove, 1);
        budgetMonth = await budgetMonth.save();
        res.send(budgetMonth);
    });
}