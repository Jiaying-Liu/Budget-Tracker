import axios from 'axios';
import { FETCH_USER, FETCH_BUDGET_MONTHS, FETCH_CURRENT_MONTH, FETCH_BUDGET_ITEM } from './types';

// user actions
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
};

// budget month actions
export const fetchCurrentMonth = () => async dispatch => {
    console.log('fetching current month');
    var d = new Date();
    var month = d.getMonth();
    var year = d.getFullYear();

    const res = await axios.get('/api/budget_months/get_month', {
        params: {
            month,
            year
        }
    });

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
}

export const setCurrentMonth = currentMonth => async dispatch => {
    const { month, year } = currentMonth;
    
    const res = await axios.get('/api/budget_months/get_month', {
        params: {
            month,
            year
        }
    });

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
}

export const fetchBudgetMonths = () => async dispatch => {
    const res = await axios.get('/api/budget_months');

    dispatch({ type: FETCH_BUDGET_MONTHS, payload: res.data });
};

export const deleteBudgetMonth = budgetMonth => async dispatch => {
    const { month, year } = budgetMonth;

    await axios.delete('/api/budget_months/budget_month', {
        params: {
            month, 
            year
        }
    });

    dispatch({ type: FETCH_CURRENT_MONTH, payload: null });
}

export const createBudgetMonth = values => async dispatch => {
    const res = await axios.post('/api/budget_months/create', values);

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
};

export const addBudgetItem = values => async dispatch => {
    const res = await axios.post('/api/budget_months/add_budget_item', values);

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
}

export const saveBudgetItem = values => async dispatch => {
    const res = await axios.post('/api/budget_months/save_budget_item', values);

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
}

export const removeBudgetItem = values => async dispatch => {
    const res = await axios.post('/api/budget_months/remove_budget_item', values);

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
}

export const setBudgetItem = (name, category, amount) => dispatch => {
    const budgetItem = { name, category, amount };
    dispatch({ type: FETCH_BUDGET_ITEM, payload: budgetItem});
}

export const setBudgetLimit = values => async dispatch => {
    const res = await axios.post('/api/budget_months/update_limit', values);
    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });    
}

export const setUserConfig = values => async dispatch => {
    const res = await axios.post('/api/users/config', values);
    dispatch({ type: FETCH_USER, payload: res.data });
}