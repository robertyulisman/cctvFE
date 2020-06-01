import {ADD_NAVIGATION, CLEAR_NAVIGATION} from './actionTypes';
export const addNavigation = (name, params) => async (dispatch) => {
  await dispatch({
    type: ADD_NAVIGATION,
    payload: {
      name,
      params: params || {},
    },
  });
};

export const runNavigate = () => async (dispatch) => {
  await dispatch({
    type: CLEAR_NAVIGATION,
  });
};
