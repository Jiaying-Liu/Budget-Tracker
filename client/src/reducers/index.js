import { combineReducers } from 'redux';
import authReducer from './authReducer';
import budgetMonthsReducer from './budgetMonthReducer';
import currentMonthReducer from './currentMonthReducer';

export default combineReducers({
    auth: authReducer,
    budgetMonths: budgetMonthsReducer,
    currentMonth: currentMonthReducer
});