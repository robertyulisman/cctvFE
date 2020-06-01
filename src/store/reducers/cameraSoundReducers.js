import {
  CAMERA_SETTING_SOUND,
  CLEAR_SETTING_SOUND,
} from '../actions/actionTypes';

const initialState = {};

export default function cameraSoundSetting(state = initialState, action) {
  switch (action.type) {
    case CAMERA_SETTING_SOUND:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_SETTING_SOUND:
      return initialState;
    default:
      return state;
  }
}
