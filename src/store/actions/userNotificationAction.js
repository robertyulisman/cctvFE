import {GET_NEW_NOTIFICATION, UPDATE_NEW_NOTIFICATION} from './actionTypes';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
export const getNewNotif = (data) => async (dispatch) => {
  try {
    const response = await getData('notifications/new', data);
    if (response.data && response.data.success) {
      await dispatch({
        type: GET_NEW_NOTIFICATION,
        // payload: response.data.data,
        payload:
          response.data.data && response.data.data.length > 0
            ? response.data.data.reduce(
                (dataHistory, newNotif) => ({
                  ...dataHistory,
                  [`_${newNotif.id}_`]: newNotif,
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
export const updateNewNotif = (url) => async (dispatch) => {
  try {
    // const response = await getData(url.replace(API_URL + 'api/', ''));
    const response = await getData(
      url.replace('http://192.168.100.4:5004/api/', ''),
    );

    if (response.data && response.data.success) {
      if (response.data.data && response.data.data.length > 0) {
        await dispatch({
          type: UPDATE_NEW_NOTIFICATION,
          payload: response.data.data.reduce(
            (dataHistory, newNotif) => ({
              ...dataHistory,
              [`_${newNotif.id}_`]: newNotif,
            }),
            {},
          ),
          pagination: response.data.pagination,
        });
      }
    }
    return response;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};
