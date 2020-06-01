import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Picker,
  Platform,
} from 'react-native';
import {Avatar, Icon, Input, Button} from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../components/CustomInputText';
import CustomAlert from '../../components/CustomAlert';
import {useSelector, useDispatch} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';
import {patchData} from '../../helpers/CRUD';
import {updateProfile} from '../../store/actions/userDataAction';
import ImagePicker from 'react-native-image-picker';
import {API_URL} from 'react-native-dotenv';
import Header from '../../components/Header';

function ProfileUpdate(props) {
  const [srcImageUpdate, setSrcImageUpdate] = React.useState('');
  const {dataProfile} = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const FormUpdateUser = useFormik({
    enableReinitialize: true,
    initialValues: {...dataProfile} || {},
    validationSchema: Yup.object({
      firstName: Yup.string().nullable(),
      lastName: Yup.string().nullable(),
      email: Yup.string().email().nullable(),
      noHandPhone: Yup.string().nullable(),
      gender: Yup.string().oneOf(['male', 'female', 'others']).nullable(),
      address: Yup.string().nullable(),
      picture: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, form) => {
      dispatch(startLoading());
      try {
        const formData = new FormData();
        const fillAble = [
          'firstName',
          'lastName',
          'email',
          'noHandPhone',
          'gender',
          'address',
          'picture',
        ];
        fillAble
          .filter(
            (keyUpdate) =>
              values[keyUpdate] && values[keyUpdate] !== dataProfile[keyUpdate],
          )
          .forEach((keyUpdate) => {
            if (keyUpdate !== 'picture') {
              formData.append(keyUpdate, values[keyUpdate]);
            } else {
              formData.append('picture', {
                name: values.picture.fileName,
                type: values.picture.type,
                uri:
                  Platform.OS === 'android'
                    ? values.picture.uri
                    : values.picture.uri.replace('file://', ''),
              });
            }
          });
        const response = await patchData('users', formData);
        dispatch(endLoading());
        if (response.data && response.data.success) {
          await dispatch(updateProfile());
          CustomAlert(response.data.success, response.data.msg);
        } else {
          CustomAlert(response.data.success, response.data.msg);
        }
      } catch (err) {
        dispatch(endLoading());
        console.log(err);
        if (!(err.message === 'Network Error')) {
          if (err.response) {
            CustomAlert(err.response.data.success, err.response.data.msg);
          }
        }
      }
      dispatch(endLoading());
    },
  });
  const handleChangePicture = () => {
    const options = {
      noData: true,
      quality: 0.4,
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        console.log(response);
        setSrcImageUpdate(response.uri);
        FormUpdateUser.setFieldValue('picture', response);
      }
    });
  };
  return (
    <>
      <Header Title="Update Profile" btnBack={true} />
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Avatar
              rounded
              source={
                dataProfile.picture || srcImageUpdate
                  ? {uri: srcImageUpdate || `${API_URL}${dataProfile.picture}`}
                  : require('../../assets/icons/userImage.png')
              }
              size={130}
              overlayContainerStyle={{backgroundColor: '#fff'}}
              title={dataProfile && dataProfile.username.substring(0, 2)}
              containerStyle={style.avatar}
            />
            <TouchableOpacity
              style={{marginTop: -50, marginLeft: 80}}
              onPress={handleChangePicture}>
              <Icon
                reverse
                name="ios-camera"
                type="ionicon"
                color="grey"
                size={15}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 4, alignItems: 'center'}}>
            <CustomTextInput
              form={FormUpdateUser}
              name="firstName"
              placeholder="FirstName"
              containerStyle={style.customContainer}
              inputContainerStyle={{...style.input}}
              inputStyle={style.inputText}
            />
            <CustomTextInput
              form={FormUpdateUser}
              name="lastName"
              placeholder="LastName"
              containerStyle={style.customContainer}
              inputContainerStyle={{...style.input}}
              inputStyle={style.inputText}
            />
            <CustomTextInput
              form={FormUpdateUser}
              name="email"
              placeholder="Email"
              containerStyle={style.customContainer}
              inputContainerStyle={{...style.input}}
              inputStyle={style.inputText}
            />
            <CustomTextInput
              form={FormUpdateUser}
              name="noHandPhone"
              placeholder="No Handphone"
              containerStyle={style.customContainer}
              inputContainerStyle={{...style.input}}
              inputStyle={style.inputText}
            />
            <View style={style.picker}>
              <Picker
                style={{
                  textAlign: 'center',
                  color: 'grey',
                  marginLeft: 100,
                  width: 100,
                }}
                selectedValue={FormUpdateUser.values.gender || 'others'}
                onValueChange={FormUpdateUser.handleChange('gender')}>
                {[
                  {label: 'Male', value: 'male'},
                  {label: 'Female', value: 'female'},
                  {label: 'Others', value: 'others'},
                ].map((option) => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
            <CustomTextInput
              form={FormUpdateUser}
              containerStyle={style.customContainer}
              name="address"
              placeholder="Address"
              multiline={true}
              numberOfLines={4}
              inputContainerStyle={{...style.input}}
              inputStyle={style.inputText}
            />
            <View style={{width: '90%', paddingBottom: 50}}>
              <Button
                title="Update Profile"
                buttonStyle={style.update}
                onPress={() => FormUpdateUser.handleSubmit()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginTop: 25,
    marginLeft: 30,
    marginBottom: 20,
  },
  backIcon: {
    color: 'white',
    marginLeft: 15,
    width: 20,
  },
  avatar: {
    marginTop: 20,
    borderWidth: 5,
    borderColor: '#f6f6f8',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  input: {
    borderColor: 'transparent',
    marginTop: 5,
  },
  customContainer: {
    width: '80%',
    borderRadius: 5,
    borderWidth: 0.4,
    borderColor: '#cbcbcb',
    marginVertical: 5,
  },
  inputText: {
    fontSize: 13,
    color: '#525252',
    textAlign: 'center',
  },
  picker: {
    flex: 1,
    marginVertical: 5,
    borderWidth: 0.2,
    borderColor: '#cfcfcf',
    borderRadius: 5,
    width: '80%',
    height: 58,
    alignSelf: 'center',
  },
  inputForm: {
    color: 'grey',
    fontSize: 15,
  },
  form: {
    marginTop: 60,
    paddingHorizontal: 30,
    paddingRight: 40,
  },
  update: {
    marginTop: 20,
    height: 58,
    borderRadius: 5,
    elevation: 4,
    backgroundColor: '#40BFFF',
  },
});

export default ProfileUpdate;
