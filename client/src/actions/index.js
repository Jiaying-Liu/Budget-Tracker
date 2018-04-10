import axios from 'axios';
import { FETCH_USER, FETCH_BUDGET_MONTHS, FETCH_CURRENT_MONTH } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
};

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

export const fetchBudgetMonths = () => async dispatch => {
    const res = await axios.get('/api/budget_months');

    dispatch({ type: FETCH_BUDGET_MONTHS, payload: res.data });
};

export const setBudgetMonth = values => async dispatch => {
    const res = await axios.post('/api/budget_months', values);

    dispatch({ type: FETCH_CURRENT_MONTH, payload: res.data });
};