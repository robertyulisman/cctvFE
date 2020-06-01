import {ToastAndroid} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {store} from '../store';
export default class NotificationManager {
  constructor(onNotification) {
    this.configure(onNotification);
  }

  configure(onNotification) {
    PushNotification.configure({
      onRegister: (token) => {
        console.log(token);
      },
      onNotification: onNotification,
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  _createNotification(data, options = {}) {
    const soundSetting = store.getState().cameraSoundSetting;
    return {
      id: `${data.id}`,
      autoCancel: true,
      smallIcon: options.smallIcon || 'ic_launcher',
      largeIcon: false,
      bigText: options.unSend
        ? 'New Detection Motion'
        : `Detect ${data.objectDetected} at ${data.cameraCCTV.name}` || '',
      title: options.unSend
        ? `${options.countUnSend} New Detection Motion`
        : `Detect ${data.objectDetected}`, // (optional)
      color: '#40BFFF', // (optional) default: system default
      vibrate: options.vibrate || false,
      vibration: options.vibration || 1000,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      message: options.unSend
        ? 'New Detection Motion'
        : `Detect ${data.objectDetected} at ${data.cameraCCTV.name}` || '',
      playSound: true,
      soundName:
        soundSetting[`_${data.CCTVId}_`] === 'mute'
          ? 'no_sound'
          : 'notif_alarm',
      data: data,
    };
  }
  showNotification(data, options = {}) {
    PushNotification.localNotification({
      ...this._createNotification(data, options),
    });
  }
  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotif(id) {
    PushNotification.cancelLocalNotifications({id: `${id}`});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
