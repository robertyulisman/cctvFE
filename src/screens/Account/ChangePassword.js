import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import {Avatar, Input, Button} from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';
import {changePassword} from '../../store/actions/userDataAction';
import * as Yup from 'yup';
import CustomInputText from '../../components/CustomInputText';
import CustomAlert from '../../components/CustomAlert';
import Header from '../../components/Header';
function ChangePassword(props) {
  const [hidePassword, setHidePassword] = React.useState(true);
  const dispatch = useDispatch();
  const FormChangePass = useFormik({
    initialValues: {old_password: '', new_password: '', confirm_password: ''},
    validationSchema: Yup.object({
      old_password: Yup.string().required('Passowrd is Required'),
      new_password: Yup.string().required('New Password is Required'),
      confirm_password: Yup.string().required('Confirm Password is Required'),
    }),
    onSubmit: async (values, form) => {
      dispatch(startLoading());
      try {
        const response = await dispatch(changePassword(values));
        dispatch(endLoading());
        if (response && response.data.success) {
          await CustomAlert(response.data.success, response.data.msg);
        } else {
          await CustomAlert(response.data.success, response.data.msg);
        }
      } catch (err) {
        dispatch(endLoading());
        if (!(err.message === 'Network Error')) {
          if (err.response) {
            CustomAlert(err.response.data.success, err.response.data.msg);
          }
        }
        console.log('error', err);
      }
      dispatch(endLoading());
    },
  });

  return (
    <>
      <Header Title="Change Password" btnBack={true} />
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: 50,
          }}>
          <CustomInputText
            form={FormChangePass}
            containerStyle={style.customContainer}
            name="old_password"
            placeholder="Old Password"
            secureTextEntry={hidePassword ? true : false}
            inputContainerStyle={{...style.input}}
            inputStyle={style.inputText}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Icons
                  name={hidePassword ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                />
              </TouchableOpacity>
            }
          />
          <CustomInputText
            placeholder="New Password"
            containerStyle={style.customContainer}
            form={FormChangePass}
            name="new_password"
            secureTextEntry={hidePassword ? true : false}
            inputContainerStyle={{...style.input}}
            inputStyle={style.inputText}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Icons
                  name={hidePassword ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                />
              </TouchableOpacity>
            }
          />
          <CustomInputText
            placeholder="Confirm Password"
            containerStyle={style.customContainer}
            form={FormChangePass}
            name="confirm_password"
            secureTextEntry={hidePassword ? true : false}
            inputContainerStyle={{...style.input}}
            inputStyle={style.inputText}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Icons
                  name={hidePassword ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                />
              </TouchableOpacity>
            }
          />
          <View style={{width: '100%', paddingBottom: 50}}>
            <Button
              title="Reset Password"
              buttonStyle={style.changebtn}
              onPress={FormChangePass.handleSubmit}
              disabled={!FormChangePass.isValid}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  customContainer: {
    padding: 4,
    alignItems: 'center',
  },
  input: {
    width: '90%',
    borderRadius: 5,
    borderWidth: 0.6,
    borderColor: '#cbcbcb',
    marginVertical: 5,
    height: 58,
    paddingHorizontal: 20,
  },
  inputText: {
    fontSize: 13,
    color: '#525252',
  },
  changebtn: {
    marginTop: 20,
    width: '90%',
    borderRadius: 5,
    height: 58,
    backgroundColor: '#40BFFF',
    elevation: 4,
    alignSelf: 'center',
  },
});

export default ChangePassword;
