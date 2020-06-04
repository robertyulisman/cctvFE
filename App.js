/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import Routes from './src/routes/MainNavigation';
import Loading from './src/components/Loading';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';
import {
  navigationRef,
  isMountedRef,
  navigate,
} from './src/helpers/RootNavigation';
import * as RootNavigation from './src/helpers/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {addNavigation} from './src/store/actions/queueNavigate';

function App(props) {
  console.log('propssssssss', props);
  console.log('monted', (isMountedRef.current = true));
  // isMountedRef.current = true;
  // return () => (isMountedRef.current = false);

  React.useEffect(() => {
    // messaging()
    //   .getInitialNotification()
    //   .then((remoteMessage) => {
    //     console.log(remoteMessage);
    //     if (remoteMessage) {
    //       alert('ketika inisial');
    //     }
    //   });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // handle with local notification on foreground
      const soundSetting = store.getState().cameraSoundSetting;
      console.log('respon firebase', remoteMessage);
      PushNotification.localNotification({
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        importance: 'high', // (optional) set notification importance, default: high
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

        smallIcon: 'ic_launcher',
        color: '#40BFFF',
        /* iOS and Android properties */
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        playSound: true, // (optional) default: true
        soundName:
          soundSetting[`_${remoteMessage.data.CCTVId}_`] === 'mute'
            ? 'no_sound'
            : 'notif_alarm', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)

        data: remoteMessage,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={style.mainView}>
          <NavigationContainer /* ref={navigationRef} */>
            <Routes />
          </NavigationContainer>
        </View>
        <Loading />
      </PersistGate>
    </Provider>
  );
}
const style = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default App;
