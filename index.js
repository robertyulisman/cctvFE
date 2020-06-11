/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';
import {store} from './src/store';
import {getNewNotif} from './src/store/actions/userNotificationAction';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  store.dispatch(getNewNotif());
  console.log('respon firebase background', remoteMessage);
  const soundSetting = store.getState().cameraSoundSetting;
  const soundNotif =
    soundSetting[`_${remoteMessage.data.CCTVId}_`] === 'mute'
      ? 'no_sound'
      : 'notif_alarm';

  Sound.setCategory('Playback');
  const whoosh = new Sound(soundNotif, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }

    // loaded successfully
    console.log(
      'duration in seconds: ' +
        whoosh.getDuration() +
        'number of channels: ' +
        whoosh.getNumberOfChannels(),
    );

    // Play the sound with an onEnd callback
    whoosh.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });
  //
});

// }
//   render() {
//     return <App />;
//   }
// }

// const io = socket(API_URL, {
//   reconnection: true,
//   reconnectionDelay: 2000,
//   reconnectionDelayMax: 5000,
//   reconnectionAttempts: Infinity,
// });
// const HandleNotification = async (data) => {
//   if (data.new || data.unSend) {
//     store.dispatch(runNavigate());
//     const notif = new NotificationManager((notification) => {
//       RootNavigation.navigate('DetailNotificationImage', {
//         history: notification.data,
//       });
//     });
//     const dataNotif = JSON.parse(data.data);
//     if (data.new || (data.unSend && parseInt(dataNotif.count) === 1)) {
//       if (!RootNavigation.isMountedRef.current) {
//         store.dispatch(
//           addNavigation('DetailNotificationImage', {
//             history: dataNotif,
//           }),
//         );
//       }

//       io.emit('notif-send-success', dataNotif.id);
//       await notif.cancelNotif(dataNotif.id.toString());
//       notif.showNotification(dataNotif);
//       store.dispatch(getUserCamera());
//     } else {
//       const notifUnsend = new NotificationManager((notification) => {
//         RootNavigation.navigate('Notification', {
//           unRead: notification.data.count,
//         });
//       });
//       if (!RootNavigation.isMountedRef.current) {
//         store.dispatch(
//           addNavigation('Notification', {
//             unRead: dataNotif.count,
//           }),
//         );
//       }

//       io.emit('notif-send-success', dataNotif.id);
//       await notifUnsend.cancelNotif(dataNotif.id.toString());
//       notifUnsend.showNotification(dataNotif, {
//         unSend: true,
//         countUnSend: dataNotif.count,
//       });
//       store.dispatch(getUserCamera());
//     }
//   }
// };

// AppRegistry.registerHeadlessTask('Notification', () => HandleNotification);
AppRegistry.registerComponent(appName, () => App);
