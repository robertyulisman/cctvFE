import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';
import {addCameraSetting} from '../../store/actions/cameraSoundAction';
import {getUserCamera} from '../../store/actions/userCameraAction';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import {patchData} from '../../helpers/CRUD';
import CustomAlert from '../../components/CustomAlert';
import * as Yup from 'yup';
export default function Home(props) {
  const camera = props.camera;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const soundSettings = useSelector((state) => state.cameraSoundSetting);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const handleSettingSound = async (key) => {
    console.log(soundSettings[key]);
    await dispatch(
      addCameraSetting({
        [key]: soundSettings[key] !== 'mute' ? 'mute' : 'unmute',
      }),
    );
  };
  const openUpdate = () => {
    setIsUpdate(true);
  };
  const updateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: camera.name,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(20, 'Maximal 20 Characters')
        .required('Name is Required'),
    }),
    onSubmit: async (values, form) => {
      dispatch(startLoading());
      try {
        if (values.name !== camera.name) {
          const response = await patchData(`camera-cctv/${camera.id}`, values);
          await dispatch(endLoading());
          if (response.data && response.data.success) {
            dispatch(getUserCamera());
            form.setSubmitting(false);
            form.resetForm();
            CustomAlert(response.data.success, response.data.msg);
          } else {
            CustomAlert(response.data.success, response.data.msg);
          }
        }
      } catch (err) {
        await dispatch(endLoading());
        console.log(err);
        if (!(err.message === 'Network Error')) {
          if (err.response) {
            CustomAlert(err.response.data.success, err.response.data.msg);
          }
        }
      }
      dispatch(endLoading());
      setIsUpdate(false);
    },
  });
  return (
    <View style={{marginVertical: 10, position: 'relative'}}>
      <FastImage
        source={
          camera.CCTVNotifications.length > 0
            ? {uri: camera.CCTVNotifications[0].lastImage}
            : require('../../assets/icons/camera.png')
        }
        onProgress={() => <ActivityIndicator color="#40BFFF" />}
        style={{
          width: '100%',
          height: 250,
        }}
      />
      <View
        style={{
          paddingTop: 5,
          paddingHorizontal: 10,
          flex: 1,
          position: 'absolute',
        }}>
        <View
          style={{
            backgroundColor: '#40BFFF',
            elevation: 3,
            borderRadius: 3,
            paddingVertical: 4,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <>
            {!isUpdate && (
              <>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 22,
                    marginRight: 15,
                    textAlign: 'center',
                  }}>
                  {camera.name}
                </Text>
                <TouchableOpacity onPress={openUpdate}>
                  <Icons name="pen" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
            {isUpdate && (
              <>
                <Input
                  placeholder="Name CCTV"
                  value={`${updateFormik.values.name}`}
                  errorMessage={updateFormik.errors.name}
                  onChangeText={updateFormik.handleChange('name')}
                  inputStyle={{
                    paddingVertical: 0,
                    alignSelf: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}
                  containerStyle={{
                    alignItems: 'center',
                  }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                  }}
                />
                <TouchableOpacity onPress={updateFormik.handleSubmit}>
                  <Icons
                    name="check"
                    size={20}
                    color="#fff"
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
              </>
            )}
          </>
        </View>
        <View style={{flexDirection: 'row', marginTop: 120}}>
          <Button
            onPress={() =>
              navigation.navigate('AlarmConfig', {
                CCTVId: camera.id,
                alarmSchedule: camera.alarmSchedule,
              })
            }
            buttonStyle={style.btnStyle}
            icon={
              <Icons
                name="calendar-alt"
                size={20}
                color={
                  camera.alarmSchedule && camera.alarmSchedule.isOn
                    ? '#40BFFF'
                    : '#999'
                }
              />
            }
          />
          <Button
            onPress={() => handleSettingSound(`_${camera.id}_`)}
            buttonStyle={style.btnStyle}
            icon={
              <Icons
                name={
                  soundSettings[`_${camera.id}_`] !== 'mute'
                    ? 'volume-up'
                    : 'volume-mute'
                }
                size={20}
                color={
                  soundSettings[`_${camera.id}_`] !== 'mute'
                    ? '#40BFFF'
                    : '#999'
                }
              />
            }
          />
          <Button
            onPress={() =>
              navigation.navigate('History', {
                CCTVId: camera.id,
                CCTVname: camera.name,
              })
            }
            buttonStyle={style.btnStyle}
            icon={<Icons name="history" size={20} color="#999" />}
          />
        </View>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  btnStyle: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});
