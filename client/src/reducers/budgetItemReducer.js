import { FETCH_BUDGET_ITEM } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_BUDGET_ITEM:
            return action.payload;
        default:
            return state;
    }
}