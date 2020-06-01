import {ADD_NAVIGATION, CLEAR_NAVIGATION} from '../actions/actionTypes';

const initialState = {
  name: '',
  params: {},
};

export default function queueNavigate(state = initialState, action) {
  switch (action.type) {
    case ADD_NAVIGATION:
      return {
        ...action.payload,
      };
    case CLEAR_NAVIGATION:
      return {
        name: '',
        params: {},
      };
    default:
      return state;
  }
}
