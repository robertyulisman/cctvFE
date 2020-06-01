import {
  GET_NEW_NOTIFICATION,
  CLEAR_NEW_NOTIFICATION,
  UPDATE_NEW_NOTIFICATION,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  pagination: {},
};

export default function userHistory(state = initialState, action) {
  switch (action.type) {
    case GET_NEW_NOTIFICATION:
      return {
        data: action.payload,
        // pagination: action.pagination,
      };
    case UPDATE_NEW_NOTIFICATION:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
        pagination: action.pagination,
      };
    case CLEAR_NEW_NOTIFICATION:
      return initialState;
    default:
      return state;
  }
}
