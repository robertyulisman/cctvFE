import {combineReducers} from 'redux';
import isLoading from './loading';
import userData from './userDataReducers';
import userCamera from './userCameraReducers';
import userHistory from './userHistoryReducers';
import userNewNotif from './userNewNotifReducers';
import cameraSoundSetting from './cameraSoundReducers';
import queueNavigate from './queueNavigate';
export default combineReducers({
  isLoading,
  userData,
  userCamera,
  userHistory,
  cameraSoundSetting,
  userNewNotif,
  queueNavigate,
});
