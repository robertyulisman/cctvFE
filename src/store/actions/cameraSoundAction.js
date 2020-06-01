import {CAMERA_SETTING_SOUND} from './actionTypes';

export const addCameraSetting = (data) => async (dispatch) => {
  try {
    await dispatch({
      type: CAMERA_SETTING_SOUND,
      payload: {
        ...data,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
