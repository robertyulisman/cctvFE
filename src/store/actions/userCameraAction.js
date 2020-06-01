import {
  GET_USER_CAMERA,
  CAMERA_SETTING_SOUND,
  UPDATE_DATA_USER_CAMERA,
} from './actionTypes';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
export const getUserCamera = () => async (dispatch) => {
  try {
    const response = await getData('camera-cctv');
    if (response.data && response.data.success) {
      await dispatch({
        type: GET_USER_CAMERA,
        payload: response.data.data.reduce((dataCamera, camera) => {
          return {
            ...dataCamera,
            [`_${camera.id}_`]: camera,
          };
        }, {}),
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
export const updateDataUserCamera = (url) => async (dispatch) => {
  try {
    const response = await getData(url.replace(API_URL + 'api/', ''));
    if (response.data && response.data.success) {
      await dispatch({
        type: UPDATE_DATA_USER_CAMERA,
        payload: response.data.data.reduce((dataCamera, camera) => {
          return {
            ...dataCamera,
            [`_${camera.id}_`]: camera,
          };
        }, {}),
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
