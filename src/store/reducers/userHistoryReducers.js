import {
  GET_HISTORY,
  CLEAR_HISTORY,
  UPDATE_HISTORY,
} from '../actions/actionTypes';

const initialState = {
  data: {},
  pagination: {},
};

export default function userHistory(state = initialState, action) {
  switch (action.type) {
    case GET_HISTORY:
      return {
        data: action.payload,
        pagination: action.pagination,
      };
    case UPDATE_HISTORY:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
        pagination: action.pagination,
      };
    case CLEAR_HISTORY:
      return initialState;
    default:
      return state;
  }
}
