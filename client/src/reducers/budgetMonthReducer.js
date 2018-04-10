import { FETCH_BUDGET_MONTHS } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_BUDGET_MONTHS:
            return action.payload;
        default:
            return state;
    }
}