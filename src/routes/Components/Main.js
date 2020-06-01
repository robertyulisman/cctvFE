import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Home from '../../screens/Home/Home';
import History from '../../screens/History/History';
import Account from '../../screens/Account/Account';
import Icon from 'react-native-vector-icons/FontAwesome5';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Axios from 'axios';
import {API_URL} from 'react-native-dotenv';

function Main(props) {
  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      handleChangeStatus(notification.data);
    },
  });

  const handleChangeStatus = (item) => {
    const status = 1;

    Axios.post(`${API_URL}api/notifications/${status}`, {
      id: item.data.id,
    })
      .then((res) => {
        console.log('sukses ganti status', res.data);
        props.navigation.navigate('DetailNotificationImage', {
          history: item.data,
          type: 'from fcm',
        });
      })
      .catch((err) => console.log('error ganti status', err));
  };

  React.useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          handleChangeStatus(remoteMessage);
        }
      });
  });
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Account':
              iconName = 'user';
              break;
            default:
              iconName = 'spinner';
              break;
          }
          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
      activeColor="#40BFFF"
      inactiveColor="#9098B1"
      barStyle={{backgroundColor: '#fff'}}
      labeled={false}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
