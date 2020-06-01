import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {Button, Image} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';
import {userLogin} from '../../store/actions/userDataAction';
import {useFormik} from 'formik';
import CustomInputText from '../../components/CustomInputText';
import CustomAlert from '../../components/CustomAlert';
import messaging from '@react-native-firebase/messaging';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';

function Login(props) {
  const [hidePassword, setHidePassword] = React.useState(true);
  const dispatch = useDispatch();
  const FormLogin = useFormik({
    initialValues: {username: '', password: ''},
    validationSchema: Yup.object({
      username: Yup.string().required('Username/Email is Required'),
      password: Yup.string().required('Password is Required'),
    }),
    onSubmit: async (values, form) => {
      const token = await messaging().getToken();

      const newValues = {
        username: values.username,
        password: values.password,
        token: token,
      };

      // console.log('new value', newValues);
      dispatch(startLoading());
      try {
        const response = await dispatch(userLogin(newValues));

        if (response.data && !response.data.success) {
          CustomAlert(response.data.success, response.data.msg);
        } else if (response.data && response.data.success) {
          // alert('selamat datang');
          AsyncStorage.setItem('deviceToken', token);
        }
      } catch (err) {
        dispatch(endLoading());
        console.log('er', err);
        if (!(err.message === 'Network Error')) {
          if (err.response) {
            CustomAlert(err.response.data.success, err.response.data.msg);
          }
        }
      }
      dispatch(endLoading());
    },
  });

  return (
    <View style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.header}>
          <Image
            source={require('../../assets/icons/blueLogo.png')}
            style={{
              width: 87,
              height: 122.17,
            }}
          />
          <Text style={style.headerText}>Welcome to CCTV SecurityMAX</Text>
          <Text style={style.headerQuotes}>Sign in to continue</Text>
        </View>
        <View>
          <CustomInputText
            form={FormLogin}
            name="username"
            placeholder="username/Email ..."
            containerStyle={style.inputContainer}
            inputContainerStyle={style.input}
            inputStyle={style.inputText}
            leftIcon={<Icons name="id-badge" size={25} color="grey" />}
          />
          <CustomInputText
            secureTextEntry={hidePassword ? true : false}
            form={FormLogin}
            name="password"
            leftIcon={<Icons name="lock" size={20} color="grey" />}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Icons
                  name={hidePassword ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                />
              </TouchableOpacity>
            }
            rightIconContainerStyle={{paddingRight: 20}}
            placeholder="Password ..."
            containerStyle={style.inputContainer}
            inputContainerStyle={style.input}
            inputStyle={style.inputText}
          />
          <View>
            <Button
              title="Sign in"
              buttonStyle={style.login}
              titleStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Poppins',
              }}
              onPress={FormLogin.handleSubmit}
            />
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              marginBottom: 30,
            }}>
            <View
              style={{
                borderBottomColor: '#efefef',
                borderBottomWidth: 1,
                flex: 1,
              }}
            />
            <Text
              style={{
                fontFamily: 'Poppins',
                position: 'relative',
                top: 10,
                width: 50,
                textAlign: 'center',
                fontSize: 15,
                color: '#888',
                fontWeight: 'bold',
              }}>
              OR
            </Text>
            <View
              style={{
                borderBottomColor: '#efefef',
                borderBottomWidth: 1,
                flex: 1,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('CheckUsername')}>
            <Text
              style={{
                fontFamily: 'Poppins',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#40BFFF',
                fontSize: 14,
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Poppins',
    color: '#223263',
    lineHeight: 35,
    marginVertical: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerQuotes: {
    color: '#9098B1',
    marginBottom: 35,
  },
  login: {
    width: '100%',
    marginVertical: 20,
    height: 54,
    borderRadius: 5,
    backgroundColor: '#40BFFF',
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomWidth: 0,
    width: 343,
    height: 58,
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  inputText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    paddingLeft: 20,
    color: '#525252',
  },
});
export default Login;
