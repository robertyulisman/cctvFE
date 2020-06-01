import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_UNPAID,
  UPDATE_PROFILE,
} from '../actions/actionTypes';
const initialState = {
  token: '',
  isLogin: false,
  unPaid: false,
  dataProfile: {},
};

export default function userData(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        isLogin: true,
        ...action.payload,
      };
    case USER_UNPAID:
      return {
        ...state,
        isLogin: true,
        unPaid: true,
      };
    case USER_LOGOUT:
      return initialState;
    case UPDATE_PROFILE:
      return {
        ...state,
        dataProfile: action.payload,
      };
    default:
      return state;
  }
}
