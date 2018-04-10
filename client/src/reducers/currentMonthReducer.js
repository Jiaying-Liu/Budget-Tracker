import { FETCH_CURRENT_MONTH } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_CURRENT_MONTH:
            return action.payload;
        default:
            return state;
    }
}