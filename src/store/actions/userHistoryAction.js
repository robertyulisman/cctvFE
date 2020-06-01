import {GET_HISTORY, UPDATE_HISTORY} from './actionTypes';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
export const getUserHistory = (data) => async (dispatch) => {
  try {
    const response = await getData('notifications', data);
    if (response.data && response.data.success) {
      await dispatch({
        type: GET_HISTORY,
        payload:
          response.data.data && response.data.data.length > 0
            ? response.data.data.reduce(
                (dataHistory, history) => ({
                  ...dataHistory,
                  [`_${history.id}_`]: history,
                }),
                {},
              )
            : {},
        pagination: response.data.pagination || {},
      });
    }
    return response;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};
export const updateUserHistory = (url) => async (dispatch) => {
  try {
    const response = await getData(url.replace(API_URL + 'api/', ''));
    if (response.data && response.data.success) {
      await dispatch({
        type: UPDATE_HISTORY,
        payload: response.data.data.reduce(
          (dataHistory, history) => ({
            ...dataHistory,
            [`_${history.id}_`]: history,
          }),
          {},
        ),
        pagination: response.data.pagination,
      });
    }
    return response;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};
