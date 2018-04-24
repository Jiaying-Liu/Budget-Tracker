const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const User = mongoose.model('users');

module.exports = (app) => {
    app.post('/api/users/config', requireLogin, async (req, res) => {
        const { userId, limit, categories, budgetItems } = req.body
        var user = await User.findById(userId);

        if(!user) {
            return res.status(422).send('User not found');
        }

        const defaultBudgetItems = budgetItems.map(budgetItem => {
            const { name, category, amount } = budgetItem;
            return {
                name,
                category,
                amount
            }
        });

        user.defaultBudget = limit;
        user.categories = categories;
        user.defaultBudgetItems = defaultBudgetItems;

        user = await user.save();
        res.send(user);
    });
}