import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Header from '../../components/Header';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useDispatch} from 'react-redux';
import {userLogout} from '../../store/actions/userDataAction';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';

export default function Account(props) {
  const dispatch = useDispatch();
  const {dataProfile} = useSelector((state) => state.userData);
  const handleLogout = async () => {
    const deviceToken = await AsyncStorage.getItem('deviceToken');
    const userId = dataProfile.id;

    dispatch(startLoading());
    try {
      const response = await dispatch(userLogout(userId, deviceToken));
      console.log('ini respon keluar', response.data);
      if (response.data.success) {
        AsyncStorage.removeItem('deviceToken');
        ToastAndroid.show('Success Log Out', ToastAndroid.SHORT);
      }
    } catch (err) {
      dispatch(endLoading());
      console.log('er', err);
    }
    dispatch(endLoading());
  };
  return (
    <>
      <Header Title="Account" btnBack={false} />
      <View
        style={{
          paddingHorizontal: 25,
          paddingTop: 30,
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Profile')}
          style={{marginVertical: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginRight: 15}}>
              <Icons name="user" size={22} color="#40BFFF" />
            </View>
            <View>
              <Text style={style.btnTextStyle}>Profile</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('DetailExpired')}
          style={{marginVertical: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginRight: 15}}>
              <Icons name="caret-square-down" size={22} color="#40BFFF" />
            </View>
            <View>
              <Text style={style.btnTextStyle}>Subscribe Status</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={{marginVertical: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginRight: 15}}>
              <Icons name="sign-out-alt" size={22} color="#40BFFF" />
            </View>
            <View>
              <Text style={style.btnTextStyle}>Sign Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  btnTextStyle: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#223263',
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
