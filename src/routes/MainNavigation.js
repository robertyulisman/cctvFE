import React from 'react';
import {ToastAndroid} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import PrivateNavigator from './PrivateNavigation';
import PublicNavigator from './PublicNavigation';
import {userLogout} from '../store/actions/userDataAction';
import {store} from '../store';
import jwt_decode from 'jwt-decode';

let onCheckToken = false;

async function checkToken(token) {
  const payload = jwt_decode(token);
  if (new Date(payload.exp * 1000).getTime() - new Date().getTime() <= 0) {
    store.dispatch(userLogout());
  }
  setTimeout(() => {
    onCheckToken = false;
  }, 10 * 1000);
}
function MainRoutes(props) {
  const {isLogin, token} = useSelector((state) => state.userData);
  if (isLogin) {
    if (token && !onCheckToken) {
      checkToken(token);
      onCheckToken = true;
    }
    return <PrivateNavigator />;
  } else {
    return <PublicNavigator />;
  }
}

function MainNavigation(props) {
  const Stack = createStackNavigator();
  React.useEffect(() => {
    SplashScreen.hide();
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        ToastAndroid.show('No Internet Connection', ToastAndroid.LONG);
      }
    });
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainRoutes" component={MainRoutes} />
    </Stack.Navigator>
  );
}
export default MainNavigation;
