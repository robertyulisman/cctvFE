import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_UNPAID,
  UPDATE_PROFILE,
  USER_CHANGE_PASSWORD,
  CLEAR_CAMERA,
  CLEAR_HISTORY,
  CLEAR_NEW_NOTIFICATION,
  CLEAR_SETTING_SOUND,
} from './actionTypes';
import {getData, submitData, patchData} from '../../helpers/CRUD';
import {StopService} from '../../helpers/ServiceNotification';
export const userLogin = (data) => async (dispatch) => {
  try {
    const response = await submitData('auth/login', data);
    if (response.data && response.data.success) {
      const expiredDate = response.data.data.dataProfile.subscribeExpired;
      if (
        !expiredDate ||
        new Date(expiredDate).getTime() - new Date().getTime() < 0
      ) {
        await dispatch({
          type: USER_UNPAID,
        });
      } else {
        await dispatch({
          type: USER_LOGIN,
          payload: response.data.data,
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
export const userLogout = (userId, deviceToken) => async (dispatch) => {
  // StopService();
  try {
    const response = await submitData(`auth/logout/${userId}/${deviceToken}`);
    if (response.data && response.data.success) {
      await dispatch({
        type: USER_LOGOUT,
      });
      dispatch({
        type: CLEAR_CAMERA,
      });
      dispatch({
        type: CLEAR_HISTORY,
      });
      dispatch({
        type: CLEAR_NEW_NOTIFICATION,
      });
      dispatch({
        type: CLEAR_SETTING_SOUND,
      });
    }
    return response;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};

export const updateProfile = () => async (dispatch) => {
  try {
    const response = await getData('users');
    if (response.data && response.data.success) {
      await dispatch({
        type: UPDATE_PROFILE,
        payload: response.data.data,
      });
    }
    return response.data;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};

export const changePassword = (data) => async (dispatch) => {
  try {
    const response = await patchData('users', data);
    if (response.data && response.data.success) {
      await dispatch({
        type: USER_CHANGE_PASSWORD,
        payload: response.data,
      });
    }
    return response;
  } catch (err) {
    if (!(err.message === 'Network Error')) {
      throw err;
    }
  }
};
