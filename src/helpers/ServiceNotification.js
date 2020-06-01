import {NativeModules} from 'react-native';
import {store} from '../store/';
import {API_URL} from 'react-native-dotenv';

const {NotifBackService} = NativeModules;
export const StartService = async () => {
  const userData = store.getState().userData;
  if (userData.isLogin && userData.dataProfile && userData.dataProfile.id) {
    console.log('startService');
    NotifBackService.startService(API_URL, userData.dataProfile.id.toString());
  }
};
export const StopService = async () => {
  NotifBackService.stopService();
};
export const RestartService = async () => {
  const userData = store.getState().userData;
  if (userData.isLogin && userData.dataProfile && userData.dataProfile.id) {
    console.log('restart service');
    NotifBackService.stopService();
    NotifBackService.startService(API_URL, userData.dataProfile.id.toString());
  }
};
