import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import Main from './Components/Main';
import Unpaid from '../screens/Unpaid/Unpaid';
import {useSelector} from 'react-redux';
import AlarmConfig from '../screens/AlarmConfig/AlarmConfig';
import Notification from '../screens/Notification/Notification';
import DetailNotificationImage from '../screens/Notification/DetailNotificationImage';
import DetailNotificationVideo from '../screens/Notification/DetailNotificationVideo';
import Profile from '../screens/Account/Profile';
import DetailExpired from '../screens/Account/DetailExpired';
import ProfileUpdate from '../screens/Account/ProfileUpdate';
import ChangePassword from '../screens/Account/ChangePassword';
// import BackgroundTasks from '../components/BackgroundTasks';

function PrivateNavigation(props) {
  const Stack = createStackNavigator();
  const {unPaid} = useSelector((state) => state.userData);
  if (unPaid) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Unpaid" component={Unpaid} />
      </Stack.Navigator>
    );
  } else {
    return (
      // <BackgroundTasks>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="AlarmConfig" component={AlarmConfig} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="DetailExpired" component={DetailExpired} />
        <Stack.Screen
          name="DetailNotificationVideo"
          component={DetailNotificationVideo}
        />
        <Stack.Screen
          name="DetailNotificationImage"
          component={DetailNotificationImage}
        />
      </Stack.Navigator>
      // </BackgroundTasks>
    );
  }
}

export default PrivateNavigation;
