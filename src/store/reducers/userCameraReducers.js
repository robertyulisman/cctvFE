import {
  GET_USER_CAMERA,
  CLEAR_CAMERA,
  UPDATE_DATA_USER_CAMERA,
} from '../actions/actionTypes';

const initialState = {
  data: {},
  pagination: {},
};

export default function userCamera(state = initialState, action) {
  switch (action.type) {
    case GET_USER_CAMERA:
      return {
        data: action.payload,
        pagination: action.pagination,
      };
    case UPDATE_DATA_USER_CAMERA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
        pagination: action.pagination,
      };
    case CLEAR_CAMERA:
      return initialState;
    default:
      return state;
  }
}
